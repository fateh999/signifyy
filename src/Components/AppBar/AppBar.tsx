import React, {ReactNode} from 'react';
import {ColorValue} from 'react-native';
import {Center, HStack, Typography, VStack} from 'rnmuilib';
import IconButton from '../IconButton/IconButton';
import useThemeValue from '../../Modules/ThemeModule/Hooks/useThemeValue';
import {useNavigation} from '@react-navigation/native';

type AppBarProps = {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
  titleCustom?: ReactNode;
  leftCustom?: ReactNode;
  rightCustom?: ReactNode;
  back?: boolean;
  backgroundColor?: ColorValue;
  color?: ColorValue;
};

function AppBar(props: AppBarProps) {
  const {
    title,
    left,
    right,
    titleCustom,
    leftCustom,
    rightCustom,
    back,
    backgroundColor = 'white',
    color = 'black',
  } = props;
  const theme = useThemeValue();
  const shadowColor = theme.colors.onSurface;
  const navigation = useNavigation();

  return (
    <HStack
      height={60}
      elevation={10}
      shadowColor={shadowColor}
      backgroundColor={backgroundColor}
      paddingHorizontal={10}
      alignItems={'center'}>
      {leftCustom ? (
        leftCustom
      ) : back ? (
        <VStack minWidth={35} flex={0} alignItems={'flex-start'}>
          <Center>
            <IconButton
              color={color}
              onPress={navigation.goBack}
              name={'arrow-left'}
            />
          </Center>
        </VStack>
      ) : (
        <VStack minWidth={35} flex={0} alignItems={'flex-start'}>
          {left}
        </VStack>
      )}

      {titleCustom ? (
        titleCustom
      ) : (
        <VStack flex={1}>
          <Typography
            color={color}
            numberOfLines={1}
            textAlign={'center'}
            fontSize={22}
            fontWeight={'600'}>
            {title}
          </Typography>
        </VStack>
      )}

      {rightCustom ? (
        rightCustom
      ) : (
        <VStack minWidth={35} flex={0}>
          <Center>{right}</Center>
        </VStack>
      )}
    </HStack>
  );
}

export default AppBar;
