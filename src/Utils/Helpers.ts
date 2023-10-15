import {SIGNATURE_DATA} from 'src/Modules/SigningModule/Types/CommonTypes';
import {PDFDocument} from 'pdf-lib';
import rnBlob from 'react-native-blob-util';
import {Platform} from 'react-native';
import Share from 'react-native-share';

export const guid = () => {
  function _p8(s?: boolean) {
    var p = (Math.random().toString(16) + '000000000').substring(2, 8);
    return s ? '-' + p.substring(0, 4) + '-' + p.substring(4, 4) : p;
  }
  return _p8(undefined) + _p8(true) + _p8(true) + _p8(undefined);
};

export const signPdf = async (
  initialDocument: PDFDocument,
  signatures: Array<SIGNATURE_DATA>,
  index: number,
  onFinish: (filePath: string) => void,
  onError: (error: any) => void,
) => {
  try {
    const {uri, page, x, y, height, width, blockHeight, blockWidth} =
      signatures[index];
    const signatureBase64 = await rnBlob.fs.readFile(uri, 'base64');
    let document = initialDocument;
    const pdfPage = document.getPage(page - 1);
    let signatureImage;
    try {
      signatureImage = await document.embedPng(signatureBase64);
    } catch (error) {
      signatureImage = await document.embedJpg(signatureBase64);
    }
    const scaleX = pdfPage.getWidth() / blockWidth;
    const scaleY = pdfPage.getHeight() / blockHeight;
    pdfPage.drawImage(signatureImage, {
      x: x * scaleX + 10,
      y: pdfPage.getHeight() - (y * scaleY + height * scaleY),
      width: width * scaleX,
      height: height * scaleY,
    });

    if (index === signatures.length - 1) {
      const pdfBase64 = await document.saveAsBase64({});
      const filePath = getTempFilePath();
      await writeNewDocument(filePath, pdfBase64);
      onFinish(platFormPath(filePath));
    } else {
      signPdf(document, signatures, index + 1, onFinish, onError);
    }
  } catch (error) {
    onError(error);
  }
};

export const getTempFilePath = () => {
  const filePath =
    rnBlob.fs.dirs.CacheDir + '/' + `${new Date().getTime()}.pdf`;
  return filePath;
};

export const writeNewDocument = (filePath: string, base64: string) => {
  return rnBlob.fs.writeFile(filePath, base64, 'base64');
};

export const readDocument = (filePath: string) => {
  return rnBlob.fs.readFile(filePath, 'base64');
};

export const platFormPath = (path: string) => {
  return (Platform.OS === 'android' ? 'file://' : '') + path;
};

export const sharePDF = async (filePath: string) => {
  try {
    if (Platform.OS === 'android') {
      const base64 = await readDocument(filePath);
      await Share.open({url: `data:application/pdf;base64,${base64}`});
    } else {
      let options = {
        type: 'application/pdf',
        url: filePath,
      };
      await Share.open(options);
    }
  } catch (error) {}
};
