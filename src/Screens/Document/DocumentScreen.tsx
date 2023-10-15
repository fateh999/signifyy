import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Image, Platform, StyleSheet, useWindowDimensions} from 'react-native';
import {Block, Center, Container, Typography} from 'rnmuilib';
import AppBar from 'src/Components/AppBar/AppBar';
import useThemeValue from 'src/Modules/ThemeModule/Hooks/useThemeValue';
import {RootStackParamList} from 'src/Navigation/StackNavigators/RootStackNavigator';
import IconButton from 'src/Components/IconButton/IconButton';
import useEventEmitter from 'src/Hooks/useEventEmitter';
import {guid, sharePDF, signPdf} from 'src/Utils/Helpers';
import DragBoxActive from 'src/Components/DragBoxActive/DragBoxActive';
import ZoomablePdfView from 'src/Components/ZoomablePdfView/ZoomablePdfView';
import Pdf from 'react-native-pdf';
import {SIGNATURE_DATA} from 'src/Modules/SigningModule/Types/CommonTypes';
import {PDFDocument} from 'pdf-lib';
import rnBlob from 'react-native-blob-util';
import {updateDocument} from 'src/Modules/SigningModule/Hooks/useDocumentsValue';
import Fab from 'src/Components/Fab/Fab';

function DocumentScreen() {
  const theme = useThemeValue();
  const route = useRoute<RouteProp<RootStackParamList>>();
  const {name, uri, id, status} = route.params ?? {};
  const path = Platform.OS === 'ios' ? 'file://' + uri : uri;
  const {width} = useWindowDimensions();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [signatureBoxes, setSignatureBoxes] = useState<Array<SIGNATURE_DATA>>(
    [],
  );
  const [blockHeight, setBlockHeight] = useState(0);
  const [pdfHeight, setPdfHeight] = useState(0);
  const [pdfWidth, setPdfWidth] = useState(0);
  const [page, setPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const blockHeightRef = useRef(0);
  const pdfStyle = useMemo(
    () => ({width, height: blockHeight}),
    [blockHeight, width],
  );

  const onEvent = useCallback(
    (imageUri: string) => {
      setSignatureBoxes(_signatureBoxes => [
        ..._signatureBoxes,
        {
          id: guid(),
          uri: imageUri,
          x: width / 2 - 25,
          y: blockHeight / 2 - 25,
          blockHeight: blockHeight,
          blockWidth: width,
          height: 50,
          width: 50,
          deg: 0,
          scale: 1,
          page: page,
          pdfHeight,
          pdfWidth,
        },
      ]);
    },
    [blockHeight, page, pdfHeight, pdfWidth, width],
  );

  const signDocument = useCallback(async () => {
    try {
      if (uri) {
        const base64 = await rnBlob.fs.readFile(uri, 'base64');
        const pdfDocument = await PDFDocument.load(base64);
        signPdf(
          pdfDocument,
          signatureBoxes,
          0,
          (updatedPath: string) => {
            console.log({updatedPath});
            if (route.params) {
              updateDocument({
                ...route.params,
                uri: updatedPath,
              });
              navigation.navigate('Document', {
                ...route.params,
                uri: updatedPath,
              });
            }
            setSignatureBoxes([]);
          },
          () => {},
        );
      }
    } catch (error) {}
  }, [navigation, route.params, signatureBoxes, uri]);

  useEventEmitter(id ?? ' ', onEvent);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        dragBox: {
          backgroundColor: 'rgba(0,0,0,0.2)',
        },
        pdf: {
          position: 'absolute',
          zIndex: -1,
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          opacity: 0,
        },
      }),
    [],
  );

  return (
    <Container
      backgroundColor={theme.colors.background}
      statusBarBackgroundColor={theme.colors.adaptivePrimary}
      statusBarStyle={'light-content'}>
      <AppBar
        title={name}
        back
        backgroundColor={theme.colors.adaptivePrimary}
        color={theme.colors.white}
        right={
          signatureBoxes.length > 0 ? (
            <IconButton
              name="check"
              onPress={signDocument}
              color={theme.colors.white}
            />
          ) : (
            <IconButton
              name="share-variant"
              color={theme.colors.white}
              onPress={() => {
                if (path) {
                  sharePDF(path);
                }
              }}
            />
          )
        }
      />
      <Block flex={1}>
        <Typography
          position="absolute"
          top={15}
          right={0}
          left={0}
          textAlign="center"
          color={theme.colors.onSurface}>
          {`${page} / ${numberOfPages}`}
        </Typography>
        <Center flex={1}>
          {blockHeight > 0 && (
            <Block
              overflow={'hidden'}
              height={blockHeight}
              width={width}
              elevation={10}
              shadowColor={theme.colors.onSurface}
              backgroundColor={theme.colors.white}>
              <ZoomablePdfView
                path={path}
                setPage={setPage}
                pdfStyle={pdfStyle}>
                {signatureBoxes.map((box, index) => {
                  const zero = 0;

                  return (
                    <DragBoxActive
                      key={box.id}
                      limitationHeight={blockHeight}
                      limitationWidth={width}
                      style={[
                        styles.dragBox,
                        {height: box.page === page ? box.height : zero},
                      ]}
                      draggable={box.page === page}
                      resizable={box.page === page}
                      onGestureEnd={boxPosition => {
                        const _boxArray = [...signatureBoxes];
                        const _box = _boxArray[index];
                        _boxArray[index] = {
                          ..._box,
                          x: boxPosition.x,
                          y: boxPosition.y,
                          height: boxPosition.height,
                          width: boxPosition.width,
                        };
                        setSignatureBoxes(_boxArray);
                      }}
                      {...box}>
                      <Image
                        source={{uri: box.uri}}
                        style={[StyleSheet.absoluteFill]}
                        resizeMode={'stretch'}
                      />
                    </DragBoxActive>
                  );
                })}
              </ZoomablePdfView>
            </Block>
          )}
          <Pdf
            style={styles.pdf}
            horizontal
            source={{uri: path, cache: true}}
            onLoadComplete={(_numberOfPages, __, size) => {
              setNumberOfPages(_numberOfPages);
              const aspectRatioPDF = size.width / size.height;
              setPdfHeight(size.height);
              setPdfWidth(size.width);
              console.log({
                _numberOfPages,
                size,
                h: width / aspectRatioPDF,
              });
              setBlockHeight(width / aspectRatioPDF);
              blockHeightRef.current = width / aspectRatioPDF;
            }}
          />
        </Center>
      </Block>
      {status === 'DRAFT' && (
        <Fab
          onPress={() => {
            if (route.params) {
              navigation.navigate('Signature', route.params);
            }
          }}
          icon={'draw'}
        />
      )}
    </Container>
  );
}

export default DocumentScreen;
