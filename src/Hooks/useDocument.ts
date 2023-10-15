import {useCallback, useState} from 'react';
import DocumentPicker, {
  DocumentPickerOptions,
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {SupportedPlatforms} from 'react-native-document-picker/lib/typescript/fileTypes';

function useDocument(
  callback?: (
    documentPickerResponse: Array<DocumentPickerResponse>,
    options: DocumentPickerOptions<SupportedPlatforms>,
  ) => void,
) {
  const [documents, setDocuments] = useState<Array<DocumentPickerResponse>>([]);

  const pick = useCallback(
    async (options: DocumentPickerOptions<SupportedPlatforms>) => {
      try {
        const documentPickerResponse = await DocumentPicker.pick(options);
        callback?.(documentPickerResponse, options);
        setDocuments([...documents, ...documentPickerResponse]);
      } catch (error) {}
    },
    [callback, documents],
  );

  const pickMultiple = useCallback(
    async (options: DocumentPickerOptions<SupportedPlatforms>) => {
      try {
        const documentPickerResponse = await DocumentPicker.pickMultiple(
          options,
        );
        callback?.(documentPickerResponse, options);
        setDocuments([...documents, ...documentPickerResponse]);
      } catch (error) {}
    },
    [callback, documents],
  );

  return {
    pick,
    pickMultiple,
    documents,
  };
}

export default useDocument;
