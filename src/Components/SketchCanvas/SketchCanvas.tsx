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
    // Strokes removed by undo, most recent last. Cleared when a new stroke lands.
    const undone = useRef<Stroke[]>([]);

    const startStroke = useCallback((x: number, y: number) => {
      setCurrent([[x, y]]);
    }, []);

    const extendStroke = useCallback((x: number, y: number) => {
      setCurrent((points) => (points ? [...points, [x, y]] : points));
    }, []);

    const endStroke = useCallback(() => {
      setCurrent((points) => {
        if (points?.length) {
          undone.current = [];
          setStrokes((completed) => [
            ...completed,
            {
              id: `${Date.now()}-${completed.length}`,
              points,
              color: strokeColor,
              width: strokeWidth,
            },
          ]);
        }
        return null;
      });
    }, [strokeColor, strokeWidth]);

    useImperativeHandle(
      ref,
      () => ({
        reset() {
          setStrokes([]);
          setCurrent(null);
          undone.current = [];
        },
        undo() {
          setStrokes((completed) => {
            if (!completed.length) {
              return completed;
            }
            undone.current = [
              ...undone.current,
              completed[completed.length - 1],
            ];
            return completed.slice(0, -1);
          });
        },
        redo() {
          const restored = undone.current[undone.current.length - 1];
          if (!restored) {
            return;
          }
          undone.current = undone.current.slice(0, -1);
          setStrokes((completed) => [...completed, restored]);
        },
      }),
      [],
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
