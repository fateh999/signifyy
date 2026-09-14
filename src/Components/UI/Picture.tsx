import React, {forwardRef, memo} from 'react';
import {Image, ImageProps, ImageStyle} from 'react-native';

export type PictureProps = ImageProps & ImageStyle;

function Picture(props: PictureProps, ref: React.Ref<Image>) {
  const {
    source,
    style,
    accessible,
    accessibilityLabel,
    blurRadius,
    defaultSource,
    fadeDuration,
    loadingIndicatorSource,
    onError,
    onLayout,
    onLoad,
    onLoadEnd,
    onLoadStart,
    onPartialLoad,
    onProgress,
    progressiveRenderingEnabled,
    resizeMethod,
    resizeMode,
    testID,
    ...imageStyleProps
  } = props;

  return (
    <Image
      ref={ref}
      source={source}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      blurRadius={blurRadius}
      defaultSource={defaultSource}
      fadeDuration={fadeDuration}
      loadingIndicatorSource={loadingIndicatorSource}
      onError={onError}
      onLayout={onLayout}
      onLoad={onLoad}
      onLoadEnd={onLoadEnd}
      onLoadStart={onLoadStart}
      onPartialLoad={onPartialLoad}
      onProgress={onProgress}
      progressiveRenderingEnabled={progressiveRenderingEnabled}
      resizeMethod={resizeMethod}
      resizeMode={resizeMode}
      testID={testID}
      style={[imageStyleProps, style]}
    />
  );
}

export default memo(forwardRef(Picture));
