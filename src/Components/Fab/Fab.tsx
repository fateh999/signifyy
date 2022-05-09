import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Block, Touch, Center} from 'rnmuilib';
import useThemeValue from 'src/Modules/ThemeModule/Hooks/useThemeValue';
import IconButton from '../IconButton/IconButton';

function Fab(props: {onPress: () => void; icon: string}) {
  const {onPress, icon} = props;
  const theme = useThemeValue();
  const insets = useSafeAreaInsets();
  const shadowColor = theme.colors.onSurface;

  return (
    <Block
      height={60}
      width={60}
      position={'absolute'}
      justifyContent={'center'}
      alignItems={'center'}
      right={20}
      bottom={10 + insets.bottom}>
      <Touch
        onPress={onPress}
        backgroundColor={theme.colors.primary}
        shadowColor={shadowColor}
        elevation={10}
        height={60}
        width={60}
        borderRadius={30}>
        <Center flex={1}>
          <IconButton disabled name={icon} color={'white'} />
        </Center>
      </Touch>
    </Block>
  );
}

export default Fab;
