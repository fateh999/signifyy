import React from 'react';
import {ImageResizeMode, ImageSourcePropType} from 'react-native';
import {IconProps} from 'react-native-vector-icons/Icon';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picture, Touch} from 'rnmuilib';
import {TouchProps} from 'rnmuilib/dist/Components/Touch';

type IconButtonProps = {
  type?: 'MaterialCommunityIcons' | 'Image';
  dark?: boolean;
  name?: string;
  source?: ImageSourcePropType;
  resizeMode?: ImageResizeMode;
};

function IconButton(
  props: IconButtonProps & Omit<IconProps, 'onPress' | 'name'> & TouchProps,
) {
  const {
    type = 'MaterialCommunityIcons',
    color,
    size = 28,
    borderRadius = (size * 1.5) / 2,
    name,
    source,
    resizeMode = 'contain',
    ...touchProps
  } = props;

  switch (type) {
    case 'MaterialCommunityIcons': {
      return (
        <Touch
          justifyContent={'center'}
          alignItems={'center'}
          height={size * 1.5}
          width={size * 1.5}
          borderRadius={borderRadius}
          elevation={0}
          {...touchProps}>
          {name && (
            <MaterialCommunityIcons name={name} size={size} color={color} />
          )}
        </Touch>
      );
    }

    case 'Image': {
      return (
        <Touch
          justifyContent={'center'}
          alignItems={'center'}
          height={size * 1.5}
          width={size * 1.5}
          borderRadius={borderRadius}
          elevation={0}
          {...touchProps}>
          {source && (
            <Picture
              source={source}
              height={size * 1.5}
              width={size * 1.5}
              borderRadius={borderRadius}
              padding={size * 1.5 - size}
              resizeMode={resizeMode}
            />
          )}
        </Touch>
      );
    }

    default: {
      return (
        <Touch
          justifyContent={'center'}
          alignItems={'center'}
          height={size * 1.5}
          width={size * 1.5}
          borderRadius={(size * 1.5) / 2}
          {...touchProps}>
          {name && (
            <MaterialCommunityIcons name={name} size={size} color={color} />
          )}
        </Touch>
      );
    }
  }
}

export default IconButton;
