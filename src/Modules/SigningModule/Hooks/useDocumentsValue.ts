import useObservableValue from 'src/Hooks/useObservableValue';
import documents$ from '../Observables/documents$';
import {DOCUMENT_DATA} from '../Types/CommonTypes';

function useDocumentsValue() {
  return useObservableValue(documents$);
}

export default useDocumentsValue;

export const getDocumentsValue = () => documents$.getValue();

export const setDocumentsValue = (document: Array<DOCUMENT_DATA>) => {
  documents$.next(document);
};

export const addDocument = (document: DOCUMENT_DATA) => {
  setDocumentsValue([...getDocumentsValue(), document]);
};

export const updateDocument = (document: DOCUMENT_DATA) => {
  const docIndex = [...getDocumentsValue()].findIndex(
    ({id}) => document.id === id,
  );
  setDocumentsValue(
    [...getDocumentsValue()].map((originalDocument, index) => {
      return docIndex === index ? document : originalDocument;
    }),
  );
};

export const deleteDocument = (index: number) => {
  setDocumentsValue(
    [...getDocumentsValue()].filter((_, _index) => _index !== index),
  );
};
