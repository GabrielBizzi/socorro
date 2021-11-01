import React, {memo, ReactNode} from 'react';

import {Container} from './styles';

interface ICard {
  children?: ReactNode;
  noMargin?: boolean;
}

const Card = ({children, noMargin}: ICard) => {
  return <Container noMargin={noMargin}>{children}</Container>;
};

export default memo(Card);
