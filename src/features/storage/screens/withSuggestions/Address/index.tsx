import React, { memo, useCallback, useRef, useState, useEffect } from 'react';

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

import { isValidAddress, saveProducts } from 'api';
const AddressWithSuggestions = () => {
  const { params } =
    useRoute<RouteProp<RootStackParamList, 'AddressWithSuggestions'>>();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [HasDivergenceModal, setHasDivergenceModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState('');
  const [visibleModalError, setVisibleModalError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<FormHandles>(null);
  const refInput = useRef<any>();
  const [address, setAddress] = useState('');
  const { navigate } = useNavigation();

  /**
   * Opens modal with a success text
   * @param text Text to show on modal
   */
  const openModal = useCallback((text: string) => {
    setModalMessage(text);
    setVisibleModal(true);
  }, []);

  /** Closes modal */
  const closeModal = useCallback(() => {
    setVisibleModal(false);
  }, []);

  /**
   * Resets input value
   */
  const resetValue = useCallback(() => {
    setAddress('');
    refInput.current?.clear();
  }, []);

  /** Opens error notification modal */
  const openModalError = useCallback(() => {
    setVisibleModalError(true);
  }, []);

  /** Closes error notification modal */
  const closeModalError = useCallback(() => {
    setErrorMessage('');
    setVisibleModalError(false);
    resetValue();
    setTimeout(() => {
      refInput.current?.focus();
    }, 250);
  }, [resetValue]);

  const navigateTo = useCallback(
    (screen: string, paramsScreen?: Object, input?: string) => {
      setHasDivergenceModal(false);
      setVisibleModal(false);
      if (paramsScreen) {
        navigate(screen, {
          input: input,
          ...paramsScreen,
        });
      } else {
        navigate(screen);
      }
    },
    [navigate],
  );

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

  const cancelAction = useCallback(() => {
    setHasDivergenceModal(false);
    resetValue();
    setTimeout(() => {
      refInput.current?.focus();
    }, 250);
  }, [resetValue]);

  const SaveProduct = useCallback(async () => {
    const codeUser = await AsyncStorage.getItem('codeUser');
    if (!codeUser) {
      setErrorMessage('Usuário não encontrado.\n Logue pela app Pda Admin');
      openModalError();
      return;
    }
    const CodigoCliente = await AsyncStorage.getItem('codigoFilial');
    const payload = {
      CodigoCliente: parseInt(String(CodigoCliente), 10),
      DescricaoEndereco: address,
      EAN: params.product,
      User: parseInt(codeUser, 10),
    };

    const result = await saveProducts(payload);
    if (result.isValid) {
      playSound('success');
      openModal('Produto coletado com sucesso!');
    } else {
      playSound('warn');
      setErrorMessage(
        result.erros.map((item: any) => item.mensagem).join('\n'),
      );
      openModalError();
      resetValue();
    }
    setLoading(false);
  }, [address, openModal, openModalError, params.product, resetValue]);

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
      console.log({ params, address });

      if (address === params.address) {
        SaveProduct();
      } else {

    const CodigoCliente = await AsyncStorage.getItem('codigoFilial');
        const addressValidation = await isValidAddress({
          Endereco: address,
          CodigoCliente: parseInt(CodigoCliente, 10),
        });
        if (!addressValidation.isValid) {
          playSound('warn');
          setErrorMessage(addressValidation.message);
          openModalError();
          setLoading(false);
          return;
        }
        if (params.address !== 'Este produto não possui sugestão de endereço') {
          setHasDivergenceModal(true);
        } else {
          SaveProduct();
        }
        setLoading(false);
      }
    } catch (err) {
      playSound('warn');
      setErrorMessage('Ocorreu um erro ao gravar os dados.\n tente novamente.');
      openModalError();
      setLoading(false);
    }
  }, [SaveProduct, address, openModalError, params.address]);

  return (
    <>
      <Scaffold>
        {params.address !== 'Este produto não possui sugestão de endereço' ? (
          <>
            <Markdown
              color="white"
              type="title"
              value="O endereço sugerido para este produto é:"
              style={styles.marginBottom}
            />
            <Markdown
              color="#ffb933"
              type="title"
              value={params.address}
              style={styles.marginBottom}
            />
          </>
        ) : (
          <Markdown
            color="#ffb933"
            type="title"
            value={params.address}
            style={styles.marginBottom}
          />
        )}
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
        <Modal isVisible={visibleModal}>
          <ContentModal>
            <Markdown
              color="black"
              type="subtitle"
              value={modalMessage}
              style={styles.modalMessage}
            />
          </ContentModal>
          <Button
            loading={loading}
            value="Ok"
            onPress={() =>
              navigateTo('ProductWithoutSuggestions', {
                address,
                codeFilial: params.codeFilial,
                codeUsuario: params.codeUsuario,
                url: params.url,
              })
            }
          />
        </Modal>
        <Modal isVisible={HasDivergenceModal}>
          <ContentModal>
            <Markdown
              color="black"
              type="subtitle"
              value="Endereço coletado diferente do sugerido. Deseja continuar?"
              style={styles.modalMessage}
            />
          </ContentModal>
          <Button
            loading={loading}
            value="Confirmar"
            onPress={() => SaveProduct()}
          />
          <Button
            loading={loading}
            value="Cancelar"
            background="transparent"
            onPress={cancelAction}
          />
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
export default memo(AddressWithSuggestions);

const styles = StyleSheet.create({
  marginBottom: {
    marginBottom: 16,
    textAlign: 'center',
  },
  formStyle: {
    marginTop: 112,
  },
  modalMessage: { padding: 16 },
});
