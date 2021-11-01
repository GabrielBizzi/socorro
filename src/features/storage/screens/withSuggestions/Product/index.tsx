import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

import { Scaffold } from './styles';
import { Input, ModalError } from 'components';
import { StyleSheet } from 'react-native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from 'navigation/interfaces';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetState from '@react-native-community/netinfo';
import SoundPlayer from 'react-native-sound-player';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import { getAddressSuggestion, isValidProduct } from 'api';

const ProductWithSuggestion = () => {
  const formRef = useRef<FormHandles>(null);
  const { navigate } = useNavigation();
  const { params } =
    useRoute<RouteProp<RootStackParamList, 'ProductWithSuggestion'>>();
  const [isVisibleModalError, setVisibleModalError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [ua, setUa] = useState('');
  const refUa = useRef<any>();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      refUa.current?.focus();
    }, 250);
  }, []);
  const changeValueUa = useCallback((text) => {
    setUa(text);
  }, []);

  const navigateTo = useCallback(
    (screen: string, paramsScreen?: Object, input?: string) => {
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
   * Resets input value
   */
  const resetValue = useCallback(() => {
    changeValueUa('');
    refUa.current?.clear();
  }, [changeValueUa]);

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
    setTimeout(() => {
      refUa.current?.focus();
    }, 250);
  }, [resetValue]);

  const handleProductSelect = useCallback(async () => {
    try {
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

      const payload = {
        CodigoCliente: parseInt(CodigoCliente, 10),
        Produto: ua,
      };

      const isValid = await isValidProduct(payload);

      if (isValid.badRequest) {
        playSound('warn');
        setErrorMessage(
          isValid.message
            ? isValid.message
            : 'Ocorreu um erro durante a execução, por favor, tente novamente.',
        );
        openModalError();
        return;
      }

      const addressSuggestion = await getAddressSuggestion({
        CodigoCliente: parseInt(CodigoCliente, 10),
        EAN: ua,
      });

      resetValue();
      if (addressSuggestion?.address) {
        navigateTo('AddressWithSuggestions', {
          address: addressSuggestion?.address,
          product: ua,
        });
      } else {
        navigateTo('AddressWithSuggestions', {
          address: 'Este produto não possui sugestão de endereço',
          product: ua,
        });
      }
    } catch (err) {
      playSound('warn');
      console.log(err);
      setErrorMessage(`${err}\n tente novamente.`);
      openModalError();
    }
  }, [navigateTo, openModalError, resetValue, ua]);

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
        <Form ref={formRef} onSubmit={() => {}} style={styles.formStyle}>
          <Input
            ref={refUa}
            name="address"
            icon="barcode"
            autoFocus={true}
            label="Selecione o produto"
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

      <ModalError
        isVisible={isVisibleModalError}
        message={errorMessage}
        closeModal={closeModalError}
      />
    </>
  );
};

export default memo(ProductWithSuggestion);

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
    marginTop: 200,
  },
  buttonMargin: {
    marginTop: 150,
  },
});
