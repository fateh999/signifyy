import React, {memo} from 'react';
import Block, {BlockProps} from './Block';

function HStack(props: BlockProps) {
  const {flexDirection = 'row'} = props;

  return <Block flexDirection={flexDirection} {...props} />;
}

export default memo(HStack);
