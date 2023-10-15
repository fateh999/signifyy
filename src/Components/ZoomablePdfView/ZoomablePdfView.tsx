import React, {Dispatch, Fragment, ReactNode, SetStateAction} from 'react';
import {ViewStyle} from 'react-native';
import Pdf from 'react-native-pdf';

function ZoomablePdfView({
  path,
  pdfStyle,
  setPage,
  children,
}: {
  path: string | undefined;
  pdfStyle: ViewStyle;
  setPage: Dispatch<SetStateAction<number>>;
  children: ReactNode;
}) {
  return (
    <Fragment>
      <Pdf
        maxScale={1}
        source={{uri: path, cache: true}}
        style={[pdfStyle]}
        horizontal
        enablePaging
        onPageChanged={currentPage => {
          setPage(currentPage);
        }}
      />
      {children}
    </Fragment>
  );
}

export default ZoomablePdfView;
