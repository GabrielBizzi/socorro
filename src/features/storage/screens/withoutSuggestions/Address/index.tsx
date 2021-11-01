import React, { memo, useCallback, useRef, useState } from 'react';

import NetState from '@react-native-community/netinfo';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from 'navigation/interfaces';

import { StyleSheet } from 'react-native';
import { Scaffold, ContentMiddle, ContentModal } from './styles';
import { Button, Input, Markdown, Modal, ModalError } from 'components';

import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SoundPlayer from 'react-native-sound-player';

import { isValidAddress } from 'api';
import { parse } from 'react-native-svg';
const AddressWithoutSuggestions = () => {
  const { params } =
    useRoute<RouteProp<RootStackParamList, 'AddressWithoutSuggestions'>>();
  const [visibleHasProductsModal, setVisibleHasProductsModal] =
    useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleModalError, setVisibleModalError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<FormHandles>(null);
  const refInput = useRef<any>();
  const [address, setAddress] = useState('');
  const { navigate } = useNavigation();

  /**
   * Open alert modal
   */
  const openModal = useCallback(() => {
    setVisibleModal(true);
  }, []);

  /** Closes modal */
  const closeModal = useCallback(() => {
    setVisibleModal(false);
  }, []);

  const openHasProductsModal = useCallback(() => {
    setVisibleHasProductsModal(true);
  }, []);

  const CancelAction = useCallback(() => {
    setVisibleHasProductsModal(false);
    refInput.current?.clear();
    setTimeout(() => {
      refInput.current?.focus();
    }, 250);
  }, []);

  /** Opens error notification modal */
  const openModalError = useCallback(() => {
    setVisibleModalError(true);
  }, []);

  /** Closes error notification modal */
  const closeModalError = useCallback(() => {
    setErrorMessage('');
    setVisibleModalError(false);
    refInput.current?.clear();
    setTimeout(() => {
      refInput.current?.focus();
    }, 250);
  }, []);

  /**
   *  Play warn sound on success or failure case
   * @param type success | warn
   *
   */
  const playSound = (type: 'success' | 'warn') => {
    if (type === 'success') {
      try {
        SoundPlayer.playSoundFile('success_beep', 'wav');
      } catch (e) {
        console.log('cannot play the sound file');
      }
    } else if (type === 'warn') {
      try {
        SoundPlayer.playSoundFile('beep', 'mp3');
      } catch (e) {
        console.log('cannot play the sound file');
      }
    } else {
      return false;
    }
  };

  /** Navigate to product page */
  const navigateToProduct = useCallback(async () => {
    setVisibleHasProductsModal(false);
    closeModal();
    navigate('ProductWithoutSuggestions', {
      address,
    });
  }, [closeModal, navigate, address]);

  /** Receives address information and validate it */
  const handleAddressSubmit = useCallback(async () => {
    try {
      const dataConnected = await NetState.fetch();

      if (dataConnected.isConnected === false) {
        setErrorMessage(
          'Wifi não identificado.\n Por favor, verifique sua rede.',
        );
        openModalError();
        return;
      }

      setLoading(true);
      const CodigoCliente = await AsyncStorage.getItem('codigoFilial');

      const result = await isValidAddress({
        Endereco: address,
        CodigoCliente: parseInt(CodigoCliente, 10),
      });
      if (result.isValid) {
        if (result.message) {
          playSound('success');
          openHasProductsModal();
          setLoading(false);
        } else {
          openModal();
          setLoading(false);
        }
      } else {
        playSound('warn');
        setErrorMessage(result.message);
        openModalError();
        setLoading(false);
      }
      setLoading(false);
    } catch (err) {
      playSound('warn');
      setErrorMessage('Ocorreu um erro ao gravar os dados.\n tente novamente.');
      openModalError();
      setLoading(false);
    }
  }, [address, openHasProductsModal, openModal, openModalError]);

  return (
    <>
      <Scaffold>
        <Form style={styles.formStyle} ref={formRef} onSubmit={() => {}}>
          <Input
            ref={refInput}
            name="address"
            icon="barcode"
            autoFocus={true}
            placeholder="Insira o endereço"
            autoCorrect={false}
            onChangeText={setAddress}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={handleAddressSubmit}
          />
        </Form>
        <ContentMiddle>
          <Button
            loading={loading}
            value="Validar"
            onPress={handleAddressSubmit}
          />
        </ContentMiddle>

        <Modal isVisible={visibleHasProductsModal}>
          <ContentModal>
            <Markdown
              color="black"
              type="subtitle"
              value="Este endereço já possui produtos, deseja prosseguir?"
              style={styles.marginBottom}
            />
            <Button value="OK" onPress={navigateToProduct} />
            <Button
              value="Cancelar"
              background="transparent"
              onPress={CancelAction}
            />
          </ContentModal>
        </Modal>

        <Modal isVisible={visibleModal}>
          <ContentModal>
            <Markdown
              color="black"
              type="subtitle"
              value="Endereço validado!"
              style={styles.marginBottom}
            />
            <Button width={70} value="OK" onPress={navigateToProduct} />
          </ContentModal>
        </Modal>

        <ModalError
          isVisible={visibleModalError}
          message={errorMessage}
          closeModal={closeModalError}
        />
      </Scaffold>
    </>
  );
};
export default memo(AddressWithoutSuggestions);

const styles = StyleSheet.create({
  marginBottom: {
    marginBottom: 16,
    textAlign: 'center',
  },
  formStyle: {
    marginTop: 112,
  },
});
