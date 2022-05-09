import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import React, {Fragment, useCallback, useMemo, useRef, useState} from 'react';
import {Keyboard} from 'react-native';
import {Block, Center, Touch, Typography, useElevationStyles} from 'rnmuilib';
import useEventEmitter, {emitEvent} from 'src/Hooks/useEventEmitter';
import useThemeValue from 'src/Modules/ThemeModule/Hooks/useThemeValue';
import {ALERT_OPTIONS} from 'src/Utils/Types';

const EVENT = 'SHOW_ALERT';

export const showAlert = (options: ALERT_OPTIONS) => {
  Keyboard.dismiss();
  emitEvent(EVENT, options);
};

function AlertPopup() {
  const theme = useThemeValue();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const elevationStyles = useElevationStyles(10, theme.colors.onSurface);
  const [open, setOpen] = useState(false);

  const snapPoints = useMemo(() => ['40%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    setOpen(index === -1);
  }, []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const [alertOptions, setAlertOptions] = useState<ALERT_OPTIONS | undefined>(
    undefined,
  );

  useEventEmitter(EVENT, (options: ALERT_OPTIONS) => {
    setAlertOptions(options);
    bottomSheetRef.current?.expand();
  });

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      style={{
        ...elevationStyles,
        shadowOffset: {
          ...elevationStyles.shadowOffset,
          height: open ? 0 : -(elevationStyles.shadowOffset?.height ?? 0),
          width: 0,
        },
      }}
      handleIndicatorStyle={{backgroundColor: theme.colors.onSurface}}
      backgroundStyle={{backgroundColor: theme.colors.background}}
      enablePanDownToClose
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChanges}>
      <Block
        borderTopLeftRadius={10}
        borderTopRightRadius={10}
        flex={1}
        justifyContent={'center'}
        alignItems={'center'}
        paddingHorizontal={40}
        paddingVertical={16}>
        <Typography
          fontSize={24}
          fontWeight={'500'}
          color={theme.colors.onSurface}>
          {alertOptions?.title}
        </Typography>
        <Block height={16} />
        <Typography fontSize={17} color={theme.colors.onSurface}>
          {alertOptions?.description}
        </Typography>
        <Block height={29} />
        <Block flexDirection="row">
          {(alertOptions?.buttonList ?? []).map((button, index) => (
            <Fragment key={index}>
              <Block flex={1}>
                <Touch
                  height={46}
                  borderRadius={6}
                  elevation={5}
                  shadowColor={theme.colors.onSurface}
                  onPress={() => {
                    button.onPress();
                    bottomSheetRef.current?.close();
                  }}
                  backgroundColor={
                    button.backgroundColor ?? theme.colors.primary
                  }>
                  <Center flex={1}>
                    <Typography
                      color={button.color ?? theme.colors.white}
                      fontSize={46 / 2.5}>
                      {button.text}
                    </Typography>
                  </Center>
                </Touch>
              </Block>
              {index < (alertOptions?.buttonList ?? []).length - 1 && (
                <Block width={21} />
              )}
            </Fragment>
          ))}
        </Block>
      </Block>
    </BottomSheet>
  );
}

export default AlertPopup;
