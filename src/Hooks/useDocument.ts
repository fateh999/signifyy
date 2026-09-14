import {
  DocumentPickerOptions,
  DocumentPickerResponse,
  errorCodes,
  isErrorWithCode,
  pick,
} from '@react-native-documents/picker';
import {useCallback, useState} from 'react';

function useDocument(
  callback?: (
    documentPickerResponse: Array<DocumentPickerResponse>,
    options: DocumentPickerOptions,
  ) => void,
) {
  const [documents, setDocuments] = useState<Array<DocumentPickerResponse>>([]);

  const pickDocument = useCallback(
    async (options: DocumentPickerOptions) => {
      try {
        const documentPickerResponse = await pick(options);
        callback?.(documentPickerResponse, options);
        setDocuments([...documents, ...documentPickerResponse]);
      } catch (error) {
        if (
          isErrorWithCode(error) &&
          error.code === errorCodes.OPERATION_CANCELED
        ) {
          return;
        }

        console.error(error);
      }
    },
    [callback, documents],
  );

  return {
    pick: pickDocument,
    documents,
  };
}

export default useDocument;
