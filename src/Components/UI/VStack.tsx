import React, {memo} from 'react';
import Block, {BlockProps} from './Block';

function VStack(props: BlockProps) {
  const {flexDirection = 'column', flex = 1} = props;

  return <Block flexDirection={flexDirection} flex={flex} {...props} />;
}

export default memo(VStack);
