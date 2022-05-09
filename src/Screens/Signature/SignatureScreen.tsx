import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import React, {useCallback, useLayoutEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import ViewShot from 'react-native-view-shot';
import {SketchCanvasRef, SketchCanvas} from 'rn-perfect-sketch-canvas';
import {Block, Center, Container, HStack, Touch, Typography} from 'rnmuilib';
import {showAlert} from 'src/Components/AlertPopup/AlertPopup';
import AppBar from 'src/Components/AppBar/AppBar';
import IconButton from 'src/Components/IconButton/IconButton';
import {emitEvent} from 'src/Hooks/useEventEmitter';
import useThemeValue from 'src/Modules/ThemeModule/Hooks/useThemeValue';
import {RootStackParamList} from 'src/Navigation/StackNavigators/RootStackNavigator';

const COLORS = ['red', 'green', 'blue', 'black'];

function SignatureScreen() {
  const canvasRef = useRef<SketchCanvasRef>(null);
  const viewShotRef = useRef<ViewShot>(null);
  const theme = useThemeValue();
  const navigation = useNavigation();
  const [color, setColor] = useState<string>('black');
  const [strokeWidth, setStrokeWidth] = useState<number>(5);
  const route = useRoute<RouteProp<RootStackParamList>>();
  const {id} = route.params ?? {};

  useLayoutEffect(() => {
    canvasRef.current?.reset();
  }, []);

  const pickImage = useCallback(async () => {
    const image = await ImageCropPicker.openPicker({
      height: 200,
      cropping: true,
      mediaType: 'photo',
      multiple: false,
    });
    if (image.mime === 'image/png' || image.mime === 'image/jpeg') {
      if (id) {
        emitEvent(id, image.path);
      }
      navigation.goBack();
    } else {
      setTimeout(() => {
        showAlert({
          title: 'Select Signature',
          description: 'Please select only png or jpeg files',
          buttonList: [
            {
              text: 'Ok',
              backgroundColor: theme.colors.primary,
              onPress: () => {},
            },
          ],
        });
      }, 1000);
    }
  }, [id, navigation, theme.colors.primary]);

  return (
    <Container
      backgroundColor={theme.colors.background}
      statusBarBackgroundColor={theme.colors.adaptivePrimary}
      statusBarStyle={'light-content'}>
      <AppBar
        title={'Draw Signature'}
        back
        backgroundColor={theme.colors.adaptivePrimary}
        color={theme.colors.white}
        right={
          <IconButton
            name="image"
            color={theme.colors.white}
            onPress={pickImage}
          />
        }
      />
      <HStack height={90}>
        <Center flex={1}>
          <IconButton
            name="reload"
            onPress={() => {
              canvasRef.current?.reset();
            }}
            color={theme.colors.text}
          />
          <Typography fontSize={14} color={theme.colors.text}>
            Reset
          </Typography>
        </Center>
        <Center flex={1}>
          <IconButton
            name="undo"
            onPress={() => {
              canvasRef.current?.undo();
            }}
            color={theme.colors.text}
          />
          <Typography fontSize={14} color={theme.colors.text}>
            Undo
          </Typography>
        </Center>
        <Center flex={1}>
          <IconButton
            name="redo"
            onPress={() => {
              canvasRef.current?.redo();
            }}
            color={theme.colors.text}
          />
          <Typography fontSize={14} color={theme.colors.text}>
            Redo
          </Typography>
        </Center>
        <Center flex={1}>
          <IconButton
            name="check"
            onPress={async () => {
              const uri = await viewShotRef.current?.capture?.();
              if (id) {
                emitEvent(id, uri);
              }
              navigation.goBack();
            }}
            color={theme.colors.text}
          />
          <Typography fontSize={14} color={theme.colors.text}>
            Save
          </Typography>
        </Center>
      </HStack>
      <Block marginHorizontal={20} marginVertical={20}>
        <Block
          borderRadius={20}
          elevation={5}
          backgroundColor={theme.colors.white}>
          <ViewShot ref={viewShotRef} options={{format: 'png', quality: 1}}>
            <SketchCanvas
              ref={canvasRef}
              strokeColor={color}
              strokeWidth={strokeWidth}
              containerStyle={styles.container}
            />
          </ViewShot>
        </Block>
      </Block>
      <HStack height={60} marginHorizontal={20}>
        <Center flex={1}>
          <IconButton
            size={30 / 1.5}
            name={
              strokeWidth === 3
                ? 'circle-small'
                : strokeWidth === 5
                ? 'circle-medium'
                : 'circle'
            }
            onPress={() => {
              setStrokeWidth(_strokeWidth => {
                if (_strokeWidth === 3) {
                  return 5;
                } else if (_strokeWidth === 5) {
                  return 7;
                } else {
                  return 3;
                }
              });
            }}
            color={theme.colors.text}
          />
          <Typography fontSize={10} color={theme.colors.text}>
            Pen Tip
          </Typography>
        </Center>
        <Block flex={2} />
        {COLORS.map(colorItem => (
          <Center key={colorItem} flex={1}>
            <Touch
              elevation={0}
              onPress={() => {
                setColor(colorItem);
              }}>
              <Block
                height={24}
                width={24}
                borderRadius={12}
                backgroundColor={colorItem}
                borderWidth={color === colorItem ? 4 : 2}
                borderColor={
                  color === colorItem ? theme.colors.accent : 'transparent'
                }
              />
            </Touch>
          </Center>
        ))}
      </HStack>
    </Container>
  );
}

export default SignatureScreen;

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
});
