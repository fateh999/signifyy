import React, {memo, ReactNode} from 'react';
import {ColorValue, StatusBar, StatusBarStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Block from './Block';

export type ContainerProps = {
  children?: ReactNode;
  backgroundColor?: ColorValue;
  statusBarBackgroundColor?: ColorValue;
  statusBarStyle?: StatusBarStyle;
};

function Container(props: ContainerProps) {
  const {
    children,
    backgroundColor = 'white',
    statusBarBackgroundColor = 'lightgrey',
    statusBarStyle = 'dark-content',
  } = props;
  const insets = useSafeAreaInsets();

  return (
    <Block flex={1} backgroundColor={backgroundColor}>
      <StatusBar barStyle={statusBarStyle} />
      <Block height={insets.top} backgroundColor={statusBarBackgroundColor} />
      <Block
        flex={1}
        paddingBottom={insets.bottom}
        paddingLeft={insets.left}
        paddingRight={insets.right}>
        {children}
      </Block>
    </Block>
  );
}

export default memo(Container);
