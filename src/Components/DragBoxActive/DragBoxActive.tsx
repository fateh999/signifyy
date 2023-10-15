/* eslint-disable react-native/no-inline-styles */
import React, {ReactNode, useMemo} from 'react';
import {I18nManager, StyleSheet, ViewStyle} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import useThemeValue from 'src/Modules/ThemeModule/Hooks/useThemeValue';
import IconButton from '../IconButton/IconButton';

const clamp = (value: number, lowerBound: number, upperBound: number) => {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
};

type DragBoxActiveProps = {
  x: number;
  y: number;
  height?: number;
  width?: number;
  onGestureEnd: (gestureData: {
    x: number;
    y: number;
    height: number;
    width: number;
  }) => void;
  children: ReactNode;
  resizable?: boolean;
  draggable?: boolean;
  style: ViewStyle | Array<ViewStyle>;
  limitationWidth: number;
  limitationHeight: number;
};

function DragBoxActive({
  x,
  y,
  height = 50,
  width = 50,
  onGestureEnd,
  children,
  resizable = true,
  draggable = true,
  style,
  limitationWidth,
  limitationHeight,
}: DragBoxActiveProps) {
  const zIndex = useSharedValue(1);
  const boxX = useSharedValue(x ?? 0);
  const boxY = useSharedValue(y ?? 0);
  const boxHeight = useSharedValue(height ?? 50);
  const boxWidth = useSharedValue(width ?? 50);
  const ctxBox = useSharedValue({
    x,
    y,
    height,
    width,
  });
  const theme = useThemeValue();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: boxX.value,
      },
      {
        translateY: boxY.value,
      },
    ],
    height: boxHeight.value,
    width: boxWidth.value,
    zIndex: zIndex.value,
  }));

  const dragGesture = Gesture.Pan()
    .onBegin(() => {
      zIndex.value = 2;
    })
    .onUpdate(ev => {
      if (!draggable) {
        return;
      }
      boxX.value = clamp(
        ctxBox.value.x + ev.translationX,
        0,
        limitationWidth - boxWidth.value,
      );
      boxY.value = clamp(
        ctxBox.value.y + ev.translationY,
        0,
        limitationHeight - boxHeight.value,
      );
    })
    .onEnd(() => {
      ctxBox.value = {
        x: boxX.value,
        y: boxY.value,
        width: boxWidth.value,
        height: boxHeight.value,
      };
      if (onGestureEnd) {
        runOnJS(onGestureEnd)({
          x: boxX.value,
          y: boxY.value,
          height: boxHeight.value,
          width: boxWidth.value,
        });
      }
      zIndex.value = 1;
    });

  const resizeGesture = Gesture.Pan()
    .onBegin(() => {
      zIndex.value = 2;
    })
    .onUpdate(ev => {
      if (!resizable) {
        return;
      }
      const minWidth = 25;
      const minHeight = 25;

      boxWidth.value = clamp(
        ctxBox.value.width + ev.translationX,
        minWidth,
        limitationWidth - boxX.value,
      );
      boxHeight.value = clamp(
        ctxBox.value.height + ev.translationY,
        minHeight,
        limitationHeight - boxY.value,
      );
    })
    .onEnd(() => {
      ctxBox.value = {
        x: boxX.value,
        y: boxY.value,
        width: boxWidth.value,
        height: boxHeight.value,
      };
      if (onGestureEnd) {
        runOnJS(onGestureEnd)({
          x: boxX.value,
          y: boxY.value,
          height: boxHeight.value,
          width: boxWidth.value,
        });
      }
      zIndex.value = 1;
    });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        resizeBoxStyle: {
          position: 'absolute',
          zIndex: 1,
          right: -20 / 4,
          bottom: -20 / 4,
        },
      }),
    [],
  );

  return (
    <GestureDetector gesture={dragGesture}>
      <Animated.View
        style={[
          animatedStyle,
          {
            position: 'absolute',
            flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
          },
          style,
        ]}>
        {resizable && (
          <GestureDetector gesture={resizeGesture}>
            <Animated.View style={styles.resizeBoxStyle}>
              <IconButton
                name="arrow-top-left-bottom-right"
                size={20 / 1.5}
                backgroundColor={theme.colors.primary}
                color={theme.colors.white}
                disabled
              />
            </Animated.View>
          </GestureDetector>
        )}
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

export default DragBoxActive;
