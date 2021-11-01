import React, {ReactNode, memo} from 'react';
import RNModal from 'react-native-modal';
import {Container} from './styles';

interface IModal {
  isVisible?: boolean;
  children?: ReactNode;
  noPadding?: boolean;
}

const Modal = ({isVisible, noPadding, children}: IModal) => {
  return (
    <>
      <RNModal style={{borderRadius: 16}} isVisible={isVisible}>
        <Container noPadding={noPadding}>{children}</Container>
      </RNModal>
    </>
  );
};

export default memo(Modal);
