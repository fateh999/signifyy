import React, {forwardRef, memo, ReactNode} from 'react';
import {Text, TextProps, TextStyle} from 'react-native';

export type TypographyProps = {children?: ReactNode} & TextProps & TextStyle;

function Typography(props: TypographyProps, ref: React.Ref<Text>) {
  const {
    style,
    color,
    textDecorationColor = color,
    children,
    testID,
    accessibilityHint,
    accessibilityLabel,
    accessibilityRole,
    accessibilityState,
    accessible,
    adjustsFontSizeToFit,
    allowFontScaling = false,
    ellipsizeMode,
    maxFontSizeMultiplier,
    numberOfLines,
    onLongPress,
    onLayout,
    selectionColor,
    onTextLayout,
    selectable,
    textBreakStrategy,
    onPress,
    ...textStyleProps
  } = props;

  return (
    <Text
      ref={ref}
      onPress={onPress}
      testID={testID}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessible={accessible}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      allowFontScaling={allowFontScaling}
      ellipsizeMode={ellipsizeMode}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      numberOfLines={numberOfLines}
      onLongPress={onLongPress}
      onLayout={onLayout}
      selectionColor={selectionColor}
      onTextLayout={onTextLayout}
      selectable={selectable}
      textBreakStrategy={textBreakStrategy}
      style={[textStyleProps, {color, textDecorationColor}, style]}>
      {children}
    </Text>
  );
}

export default memo(forwardRef(Typography));
