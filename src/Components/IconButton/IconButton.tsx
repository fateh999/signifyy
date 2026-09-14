import {IconProps} from '@react-native-vector-icons/common';
import {
  MaterialDesignIcons,
  MaterialDesignIconsIconName,
} from '@react-native-vector-icons/material-design-icons';
import React from 'react';
import {ImageResizeMode, ImageSourcePropType} from 'react-native';
import {Picture, Touch} from 'rnmuilib';
import {TouchProps} from 'rnmuilib/dist/Components/Touch';

type IconButtonProps = {
  type?: 'Icon' | 'Image';
  dark?: boolean;
  name?: MaterialDesignIconsIconName;
  source?: ImageSourcePropType;
  resizeMode?: ImageResizeMode;
};

function IconButton(
  props: IconButtonProps &
    Omit<IconProps<MaterialDesignIconsIconName>, 'onPress' | 'name'> &
    TouchProps,
) {
  const {
    type = 'Icon',
    color,
    size = 28,
    borderRadius = (size * 1.5) / 2,
    name,
    source,
    resizeMode = 'contain',
    ...touchProps
  } = props;

  switch (type) {
    case 'Icon': {
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
            <MaterialDesignIcons name={name} size={size} color={color} />
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
            <MaterialDesignIcons name={name} size={size} color={color} />
          )}
        </Touch>
      );
    }
  }
}

export default IconButton;
