export type DOCUMENT_STATUS = 'DRAFT' | 'SIGNED';

export type DOCUMENT_DATA = {
  id: string;
  name: string;
  uri: string;
  timeStamp: number;
  status: DOCUMENT_STATUS;
};

export type SIGNATURE_DATA = {
  id: string;
  x: number;
  y: number;
  uri: string;
  height: number;
  width: number;
  blockHeight: number;
  blockWidth: number;
  pdfHeight: number;
  pdfWidth: number;
  deg: number;
  scale: number;
  page: number;
  resizable?: boolean;
  draggable?: boolean;
  rotatable?: boolean;
};
