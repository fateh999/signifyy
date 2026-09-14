import {useMemo} from 'react';
import {ColorValue, ViewStyle} from 'react-native';

function useElevationStyles(
  elevation: number = 0,
  shadowColor: ColorValue = 'black',
): ViewStyle {
  return useMemo(
    () =>
      elevation === 0
        ? {}
        : {
            shadowOpacity: 0.0015 * elevation + 0.18,
            shadowRadius: 0.54 * elevation,
            shadowOffset: {height: 0.6 * elevation, width: 0},
            shadowColor,
            elevation,
          },
    [elevation, shadowColor],
  );
}

export default useElevationStyles;
