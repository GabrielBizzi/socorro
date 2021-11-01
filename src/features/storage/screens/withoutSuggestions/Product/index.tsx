import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

import { Scaffold, ContentModal } from './styles';
import { Input, Button, Markdown, Modal, ModalError } from 'components';
import { StyleSheet } from 'react-native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from 'navigation/interfaces';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetState from '@react-native-community/netinfo';
import SoundPlayer from 'react-native-sound-player';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import { saveProducts, isValidProduct } from 'api';

const ProductWithoutSuggestions = () => {
  const formRef = useRef<FormHandles>(null);
  const { navigate } = useNavigation();
  const { params } =
    useRoute<RouteProp<RootStackParamList, 'ProductWithoutSuggestions'>>();
  const [isVisibleModalError, setVisibleModalError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [differentProduct, setDifferentProduct] = useState<boolean>(false);
  const [ua, setUa] = useState('');
  const [lastEAN, setLastEAN] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [hasCompletedModalVisible, setHasCompletedModalVisible] =
    useState(false);
  const refUa = useRef<any>();
  const [edit, setEdit] = useState(false);

  const changeValueUa = useCallback((text) => {
    setUa(text);
  }, []);

  const navigateTo = useCallback(
    (screen: string, paramsScreen?: Object, input?: string) => {
      if (paramsScreen) {
        navigate(screen, {
          input,
          ...paramsScreen,
        });
      } else {
        navigate(screen);
      }
    },
    [navigate],
  );

  /**
   * Resets input value
   */
  const resetValue = useCallback(() => {
    changeValueUa('');
    refUa.current?.clear();
    setTimeout(() => {
      refUa.current?.focus();
    }, 250);
  }, [changeValueUa]);

  /**
   * Opens modal with a success text
   * @param text Text to show on modal
   */
  // const openModal = useCallback((text: string) => {
  //   setModalMessage(text);
  //   setModalVisible(true);
  // }, []);

  // const closeModal = useCallback(() => {
  //   setModalVisible(false);
  //   resetValue();
  //   setTimeout(() => {
  //     refUa.current?.focus();
  //   }, 250);
  // }, [resetValue]);

  /**
   * Opens modal with a success text
   * @param text Text to show on modal
   */
  const openCompleteModal = useCallback(() => {
    setHasCompletedModalVisible(true);
  }, []);

  const completeCollection = useCallback(() => {
    setHasCompletedModalVisible(false);
    navigateTo('HomeScreen', params);
  }, [navigateTo, params]);

  /**
   *  Play warn sound on success or failure case
   * @param type success | warn
   *
   */
  const playSound = async (type: 'success' | 'warn') => {
    if (type === 'success') {
      try {
        SoundPlayer.playSoundFile('success_beep', 'wav');
      } catch (e) {
        console.log('cannot play the sound file', e);
      }
    } else if (type === 'warn') {
      try {
        SoundPlayer.playSoundFile('beep', 'mp3');
      } catch (e) {
        console.log('cannot play the sound file', e);
      }
    } else {
      return false;
    }
  };

  const openModalError = useCallback(() => {
    setVisibleModalError(true);
  }, []);

  const closeModalError = useCallback(async () => {
    setErrorMessage('');
    resetValue();
    setVisibleModalError(false);
  }, [resetValue]);

  const SaveItem = useCallback(async () => {
    setDifferentProduct(false);
    setLastEAN(ua);
    const dataConnected = await NetState.fetch();
    if (dataConnected.isConnected === false) {
      setErrorMessage(
        'Wifi não identificado.\n Por favor, verifique sua rede.',
      );
      openModalError();
      return;
    }

    const codeUser = await AsyncStorage.getItem('codeUser');
    const CodigoCliente = await AsyncStorage.getItem('codigoFilial');
    if (!codeUser) {
      setErrorMessage('Usuário não encontrado.\n Logue pela app Pda Admin');
      openModalError();
      return;
    }

    const payload = {
      CodigoCliente: parseInt(CodigoCliente, 10),
      DescricaoEndereco: params.address,
      EAN: ua,
      User: parseInt(codeUser, 10),
    };

    const result = await saveProducts(payload);

    if (result.isValid) {
      playSound('success');
      resetValue();
    } else {
      console.log({ result, payload });
      await playSound('warn');
      setErrorMessage(result.message);
      openModalError();
      resetValue();
    }
  }, [openModalError, params.address, resetValue, ua]);

  const handleProductSelect = useCallback(async () => {
    try {
      if (ua === params.address) {
        playSound('success');
        openCompleteModal();
        return;
      }
      if (lastEAN && lastEAN !== ua) {
        const CodigoCliente = await AsyncStorage.getItem('codigoFilial');
        const payload = {
          CodigoCliente: parseInt(CodigoCliente, 10),
          Produto: ua,
        };
        const validation = await isValidProduct(payload);
        if (!validation.isValid) {
          setErrorMessage(validation.message);
          setVisibleModalError(true);
          return;
        }
        setDifferentProduct(true);
        return;
      }

      SaveItem();
    } catch (err) {
      playSound('warn');
      console.log(err);
      setErrorMessage(`${err}\n tente novamente.`);
      openModalError();
    }
  }, [
    SaveItem,
    lastEAN,
    openCompleteModal,
    openModalError,
    params.address,
    ua,
  ]);

  const getValue = useCallback(() => {
    if (!edit) {
      if (params && params.order) {
        return params.order;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }, [edit, params]);

  useEffect(() => {
    if (params) {
      setEdit(false);
    }
  }, [params]);

  return (
    <>
      <Scaffold>
        <Form ref={formRef} onSubmit={() => {}}>
          <Markdown
            color="white"
            type="title"
            align="center"
            value="Endereço"
            style={styles.TitleText}
          />
          <Markdown
            color="#ffb933"
            type="title"
            align="center"
            value={params.address}
            style={styles.textModal}
          />
          <Input
            ref={refUa}
            name="Produto"
            icon="barcode"
            autoFocus={true}
            value={params && params?.input === 'ua' ? getValue() : undefined}
            onChangeText={changeValueUa}
            placeholder="Código de produto"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={handleProductSelect}
          />
        </Form>
      </Scaffold>

      <Modal isVisible={hasCompletedModalVisible}>
        <ContentModal>
          <Markdown
            color="black"
            type="subtitle"
            value="Coleta de produtos encerrada"
            style={styles.validationModal}
          />
          <Button width={70} value="OK" onPress={completeCollection} />
        </ContentModal>
      </Modal>

      <Modal isVisible={differentProduct}>
        <ContentModal>
          <Markdown
            color="black"
            type="subtitle"
            value="Você bipou um produto diferente. Deseja armazená-lo neste endereço?"
            style={styles.marginBottom}
          />
          <Button value="OK" onPress={SaveItem} />
          <Button
            value="Cancelar"
            background="transparent"
            onPress={() => navigateTo('HomeScreen', params)}
          />
        </ContentModal>
      </Modal>
      <ModalError
        isVisible={isVisibleModalError}
        message={errorMessage}
        closeModal={closeModalError}
      />
    </>
  );
};

export default memo(ProductWithoutSuggestions);

const styles = StyleSheet.create({
  textModal: {
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 100,
  },
  TitleText: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  validationModal: {
    alignItems: 'center',
    padding: 16,
  },
  formStyle: {
    marginTop: 150,
  },
  buttonMargin: {
    marginTop: 150,
  },
  marginBottom: {
    marginBottom: 16,
    textAlign: 'center',
  },
});
