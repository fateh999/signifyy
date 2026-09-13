import { Canvas, Path } from "@shopify/react-native-skia";
import getStroke from "perfect-freehand";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export type Point = [number, number];

type Stroke = {
  id: string;
  points: Point[];
  color: string;
  width: number;
};

export type SketchCanvasRef = {
  reset: () => void;
  undo: () => void;
  redo: () => void;
};

type SketchCanvasProps = {
  strokeColor?: string;
  strokeWidth?: number;
  containerStyle?: StyleProp<ViewStyle>;
};

// Matches the serialization rn-perfect-sketch-canvas used, so stroke geometry
// renders identically to the previous implementation.
function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) {
    return "";
  }

  const d = stroke.reduce<(string | number)[]>(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"],
  );

  d.push("Z");
  return d.join(" ");
}

function toPath(points: Point[], width: number) {
  return getSvgPathFromStroke(getStroke(points, { size: width }));
}

const SketchCanvas = forwardRef<SketchCanvasRef, SketchCanvasProps>(
  ({ strokeColor = "black", strokeWidth = 8, containerStyle }, ref) => {
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [current, setCurrent] = useState<Point[] | null>(null);
    // Snapshots of the committed stroke list, oldest first, with `index`
    // pointing one past the live entry. Undo/redo walk the index; committing a
    // stroke or resetting truncates anything ahead of it and appends. This
    // mirrors rn-perfect-sketch-canvas' history stack, which also pushed reset
    // as a snapshot — so an accidental Reset stays recoverable via Undo.
    const history = useRef<Stroke[][]>([[]]);
    const index = useRef(1);

    const commit = useCallback((next: Stroke[]) => {
      history.current = [...history.current.slice(0, index.current), next];
      index.current = history.current.length;
      setStrokes(next);
    }, []);

    const startStroke = useCallback((x: number, y: number) => {
      setCurrent([[x, y]]);
    }, []);

    const extendStroke = useCallback((x: number, y: number) => {
      setCurrent((points) => (points ? [...points, [x, y]] : points));
    }, []);

    const endStroke = useCallback(() => {
      setCurrent((points) => {
        if (points?.length) {
          commit([
            ...history.current[index.current - 1],
            {
              id: `${Date.now()}-${index.current}`,
              points,
              color: strokeColor,
              width: strokeWidth,
            },
          ]);
        }
        return null;
      });
    }, [commit, strokeColor, strokeWidth]);

    useImperativeHandle(
      ref,
      () => ({
        reset() {
          setCurrent(null);
          commit([]);
        },
        undo() {
          if (index.current > 1) {
            index.current -= 1;
          }
          setStrokes(history.current[index.current - 1]);
        },
        redo() {
          if (index.current < history.current.length) {
            index.current += 1;
          }
          setStrokes(history.current[index.current - 1]);
        },
      }),
      [commit],
    );

    const pan = useMemo(
      () =>
        Gesture.Pan()
          .minDistance(0)
          .averageTouches(true)
          .runOnJS(true)
          .onBegin((event) => startStroke(event.x, event.y))
          .onChange((event) => extendStroke(event.x, event.y))
          .onFinalize(() => endStroke()),
      [startStroke, extendStroke, endStroke],
    );

    const completedPaths = useMemo(
      () =>
        strokes.map((stroke) => ({
          id: stroke.id,
          color: stroke.color,
          path: toPath(stroke.points, stroke.width),
        })),
      [strokes],
    );

    const currentPath = useMemo(
      () => (current ? toPath(current, strokeWidth) : null),
      [current, strokeWidth],
    );

    return (
      <View style={containerStyle}>
        <GestureDetector gesture={pan}>
          <Canvas style={styles.canvas}>
            {completedPaths.map((stroke) => (
              <Path
                key={stroke.id}
                path={stroke.path}
                color={stroke.color}
                style={"fill"}
              />
            ))}
            {currentPath ? (
              <Path path={currentPath} color={strokeColor} style={"fill"} />
            ) : null}
          </Canvas>
        </GestureDetector>
      </View>
    );
  },
);

export default SketchCanvas;

const styles = StyleSheet.create({
  canvas: { flex: 1 },
});
