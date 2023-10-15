/* eslint-disable react-native/no-inline-styles */
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Canvas, ImageSVG, useSVG} from '@shopify/react-native-skia';
import React, {useCallback} from 'react';
import {FlatList, Platform, Pressable, useWindowDimensions} from 'react-native';
import {types} from 'react-native-document-picker';
import {Block, Center, Container, Touch, Typography} from 'rnmuilib';
import svgs from 'src/Assets/svgs';
import {showAlert} from 'src/Components/AlertPopup/AlertPopup';
import AppBar from 'src/Components/AppBar/AppBar';
import Fab from 'src/Components/Fab/Fab';
import IconButton from 'src/Components/IconButton/IconButton';
import useDocument from 'src/Hooks/useDocument';
import useDocumentsValue, {
  addDocument,
  deleteDocument,
} from 'src/Modules/SigningModule/Hooks/useDocumentsValue';
import {DOCUMENT_DATA} from 'src/Modules/SigningModule/Types/CommonTypes';
import useThemeValue, {
  toggleTheme,
} from 'src/Modules/ThemeModule/Hooks/useThemeValue';
import {RootStackParamList} from 'src/Navigation/StackNavigators/RootStackNavigator';
import {
  getTempFilePath,
  guid,
  platFormPath,
  readDocument,
  writeNewDocument,
} from 'src/Utils/Helpers';

function HomeScreen() {
  const theme = useThemeValue();
  const darkMode = theme.type === 'dark';
  const shadowColor = theme.colors.onSurface;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const documents = useDocumentsValue();
  const svg = useSVG(svgs.noDocuments);
  const {width} = useWindowDimensions();

  const {pick} = useDocument(async documentPickerResponse => {
    const [docResponse] = documentPickerResponse;
    try {
      const base64 = await readDocument(
        Platform.OS === 'ios'
          ? docResponse.uri.replace('file://', '')
          : docResponse.uri,
      );
      const tempFilePath = getTempFilePath();
      await writeNewDocument(tempFilePath, base64);

      const document: DOCUMENT_DATA = {
        id: guid(),
        name: docResponse.name,
        uri: platFormPath(tempFilePath),
        timeStamp: Date.now(),
        status: 'DRAFT',
      };
      addDocument(document);
      navigation.navigate('Document', document);
    } catch (error) {
      console.log({error});
    }
  });

  const pickDocument = useCallback(() => {
    showAlert({
      title: 'Select Document',
      description: 'Please select pdf file from the phone storage',
      buttonList: [
        {
          text: 'Cancel',
          onPress: () => {},
          backgroundColor: theme.colors.background,
          color: theme.colors.onSurface,
        },
        {
          text: 'Open',
          onPress: () => {
            pick({type: types.pdf});
          },
        },
      ],
    });
  }, [pick, theme.colors.background, theme.colors.onSurface]);

  return (
    <Container
      backgroundColor={theme.colors.background}
      statusBarBackgroundColor={theme.colors.adaptivePrimary}
      statusBarStyle={'light-content'}>
      <AppBar
        title="Signifyy"
        backgroundColor={theme.colors.adaptivePrimary}
        color={theme.colors.white}
        right={
          <IconButton
            name={darkMode ? 'weather-night' : 'weather-sunny'}
            color={theme.colors.white}
            onPress={toggleTheme}
          />
        }
      />
      <Block flex={1}>
        <FlatList
          data={documents}
          renderItem={({item, index}) => (
            <Block marginHorizontal={20}>
              <Touch
                elevation={10}
                borderRadius={5}
                paddingLeft={20}
                paddingRight={8}
                height={55}
                shadowColor={shadowColor}
                borderLeftWidth={5}
                borderLeftColor={
                  item.status === 'DRAFT'
                    ? theme.colors.divider
                    : theme.colors.success
                }
                onPress={() => navigation.navigate('Document', item)}
                backgroundColor={theme.colors.surface}>
                <Block flex={1} alignItems={'center'} flexDirection={'row'}>
                  <Block flex={1}>
                    <Typography
                      color={theme.colors.onSurface}
                      numberOfLines={1}>
                      {item.name}
                    </Typography>
                  </Block>
                  <IconButton
                    name="delete"
                    color={theme.colors.error}
                    onPress={() => {
                      showAlert({
                        title: 'Delete Document',
                        description: `Are you sure you want to delete ${item.name} ?`,
                        buttonList: [
                          {
                            text: 'Cancel',
                            onPress: () => {},
                            backgroundColor: theme.colors.background,
                            color: theme.colors.onSurface,
                          },
                          {
                            text: 'Delete',
                            backgroundColor: theme.colors.error,
                            onPress: () => {
                              deleteDocument(index);
                            },
                          },
                        ],
                      });
                    }}
                  />
                </Block>
              </Touch>
            </Block>
          )}
          ItemSeparatorComponent={() => <Block height={20} />}
          ListHeaderComponent={() => <Block height={20} />}
          ListFooterComponent={() => <Block height={20} />}
          ListEmptyComponent={() => (
            <Center flex={1}>
              <Pressable style={{height: 200}} onPress={pickDocument}>
                <Canvas
                  style={{
                    flex: 1,
                    width,
                  }}>
                  {svg && (
                    <ImageSVG
                      svg={svg}
                      x={0}
                      y={0}
                      width={width}
                      height={200}
                    />
                  )}
                </Canvas>
              </Pressable>
            </Center>
          )}
          contentContainerStyle={documents.length === 0 ? {flex: 1} : {}}
        />
      </Block>

      {documents.length > 0 && <Fab onPress={pickDocument} icon={'plus'} />}
    </Container>
  );
}

export default HomeScreen;
