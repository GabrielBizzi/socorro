import Modal from '../modal';
import Button from '../button';
import Markdown from '../markdown';
import React, { memo } from 'react';
import { ContentModal } from './styles';
import { StyleSheet } from 'react-native';

interface IModalError {
  isVisible: boolean;
  closeModal: Function;
  message: string;
}

const ModalError = ({
  isVisible = false,
  message,
  closeModal,
}: IModalError) => {
  return (
    <Modal isVisible={isVisible}>
      <ContentModal>
        <Markdown
          color="black"
          type="title"
          value="Encontramos um erro!"
          style={styles.marginBottom}
        />
        <Markdown
          color="black"
          type="subtitle"
          value={message}
          style={styles.marginBottom}
        />
        <Button width={70} value="OK" onPress={() => closeModal()} />
      </ContentModal>
    </Modal>
  );
};

export default memo(ModalError);

const styles = StyleSheet.create({
  marginBottom: {
    marginBottom: 16,
    textAlign: 'center',
  },
});
