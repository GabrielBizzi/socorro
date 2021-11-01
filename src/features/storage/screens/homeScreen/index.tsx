import React, { memo, useCallback, useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from 'navigation/interfaces';
import {
  Button,
  LogoAndVersion,
  Markdown,
  Modal,
  ModalError,
} from 'components';
import {
  Scaffold,
  Container,
  TopContainer,
  Line,
  ContentButtonModal,
} from './styles';
import { deserialize, ISerializedParams } from 'utils/encode';
import { ActivityIndicator, BackHandler, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import RNBackgroundDownloader from 'react-native-background-downloader';
import { VERSION } from '@env';
import SoundPlayer from 'react-native-sound-player';
import { hasAddressSuggestion, getTokenInformation } from 'api';
import { IAuthenticated } from 'api/interfaces';

interface ILoading {
  status:
    | 'VERIFY'
    | 'CHEKING'
    | 'IN-PROGRESS'
    | 'DONE'
    | 'NOT-UPDATED'
    | 'ERROR';
}

const HomeScreen = () => {
  const { navigate } = useNavigation();
  const { params } = useRoute<RouteProp<RootStackParamList, 'HomeScreen'>>();
  const [data, setData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [authorized, setAuthorized] = useState<string | null>(null);
  const [isNotauthorizedModal, setNotAuthorizedModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<ILoading>();
  const [percentDownloaded, setPercentDownloaded] = useState<number>();
  const [visibleModalUpdate, setVisibleModalUpdate] = useState(false);
  const [isVisibleModalError, setVisibleModalError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigateTo = useCallback(
    (screen: string, paramsScreen?: Object) => {
      if (paramsScreen) {
        navigate(screen, {
          ...paramsScreen,
        });
      } else {
        navigate(screen);
      }
    },
    [navigate],
  );

  /**
   *  Beep warn sound on success or failure case
   * @param type success | warn
   *
   */
  const playSound = async (type: 'success' | 'warn') => {
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
  const openModalError = useCallback(() => {
    setVisibleModalError(true);
  }, []);

  const closeModalError = useCallback(async () => {
    setErrorMessage('');
    setVisibleModalError(false);
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });
  }, []);

  useEffect(() => {
    const version = VERSION.split('.');
    if (params?.address) {
      delete params?.address;
    }

    setVisibleModalUpdate(true);
    if (params) {
      // console.log(params.token);
      const t: ISerializedParams = deserialize(params.token);
      setData(t);

      if (t.codeUser) {
        // console.log(t);
        const saveItem = async () => {
          await AsyncStorage.setItem('codeUser', t.codeUser.toString());
          await AsyncStorage.setItem('url', t.url);
          await AsyncStorage.setItem('codigoFilial', t.codigoFilial.toString());
          await AsyncStorage.setItem('enableCamera', t.enableCamera.toString());
          await AsyncStorage.setItem('refreshToken', t.refreshToken);
          await AsyncStorage.setItem('expiration', t.expiration.toString());
          await AsyncStorage.setItem('style', t.style);
          await AsyncStorage.setItem('versaoMaior', t.versaoMaior.toString());
          await AsyncStorage.setItem('versaoMenor', t.versaoMenor.toString());
          const user: IAuthenticated = await getTokenInformation(
            t.refreshToken,
            t.url,
          );
          await AsyncStorage.setItem('accessToken', user.accessToken);
          await AsyncStorage.setItem('login', user.login);
          await AsyncStorage.setItem('name', user.nome);
        };
        saveItem();
      }
      if (
        parseInt(version[0], 10) >= t.versaoMaior &&
        parseInt(version[1], 10) >= t.versaoMenor
      ) {
        setVisibleModalUpdate(false);
      } else {
        setStatusUpdate({ status: 'NOT-UPDATED' });
      }
    } else {
      setVisibleModalUpdate(false);
      setNotAuthorizedModal(true);
    }
  }, [params]);

  useEffect(() => {
    const getItem = async () => {
      const result = await AsyncStorage.getItem('authorize');
      setAuthorized(result);
    };

    getItem();
  }, []);

  const getProductPage = useCallback(async () => {
    const url = await AsyncStorage.getItem('url');
    if (!url) {
      playSound('warn');
      setErrorMessage(
        'Erro acessar a url.\n Acesse essa aplicação pela PDA Admin novamente.',
      );
      openModalError();
      return;
    }

    const codeUser = await AsyncStorage.getItem('codeUser');
    if (!codeUser) {
      setErrorMessage('Usuário não encontrado.\n Logue pela app Pda Admin');
      openModalError();
      return;
    }
    const addressSuggestion = await hasAddressSuggestion(codeUser);

    if (addressSuggestion) {
      navigateTo('ProductWithSuggestion');
    } else {
      navigateTo('AddressWithoutSuggestions');
    }
  }, [openModalError, navigateTo]);

  const closeModalUpdated = useCallback(() => {
    setStatusUpdate({ status: 'CHEKING' });
    const android = RNFetchBlob.android;

    RNBackgroundDownloader.download({
      id: 'file123',
      url: `${data.diretorio}`,
      destination: `${RNBackgroundDownloader.directories.documents}/PdaArmazenagem${data.versaoMaior}.${data.versaoMenor}.apk`,
    })
      .begin((expectedBytes) => {
        console.log(`Going to download ${expectedBytes} bytes!`);
      })
      .progress((percent) => {
        setStatusUpdate({ status: 'IN-PROGRESS' });
        setPercentDownloaded(percent * 100);
        console.log(`Downloaded: ${percent * 100}%`);
      })
      .done(() => {
        setStatusUpdate({ status: 'NOT-UPDATED' });
        setPercentDownloaded(0);
        android.actionViewIntent(
          `${RNBackgroundDownloader.directories.documents}/PdaArmazenagem${data.versaoMaior}.${data.versaoMenor}.apk`,
          'application/vnd.android.package-archive',
        );
        console.log('Download is done!');
      })
      .error((error) => {
        setStatusUpdate({ status: 'ERROR' });
        console.log('Download canceled due to error: ', error);
      });
  }, [data]);

  const closeModalErrored = useCallback(() => {
    BackHandler.exitApp();
  }, []);

  const closeModalExit = useCallback(() => {
    BackHandler.exitApp();
  }, []);

  return (
    <Scaffold>
      <Container>
        <TopContainer>
          <LogoAndVersion />
        </TopContainer>
        <Line />
        <Button value="Produto" onPress={getProductPage} />
        <Line />
      </Container>
      <Modal isVisible={isNotauthorizedModal}>
        <Markdown
          style={styles.alignText}
          value="Autorização negada, acesse esse aplicativo a partir do Pda Admin!"
          color="black"
          type="subtitle"
        />
        <ContentButtonModal>
          <Button
            width={40}
            height={50}
            value="Ok"
            onPress={closeModalErrored}
          />
        </ContentButtonModal>
      </Modal>
      <Modal isVisible={visibleModalUpdate}>
        <Markdown
          style={styles.alignText}
          value={
            statusUpdate?.status === 'CHEKING'
              ? 'Conectando ao serviço \n Aguarde!'
              : statusUpdate?.status === 'IN-PROGRESS'
              ? `Baixando aplicação \n Progresso: ${
                  percentDownloaded?.toFixed(0) ?? '0'
                }%`
              : statusUpdate?.status === 'NOT-UPDATED'
              ? 'App desatualizado. \n Aperte para baixar o app atualizado.\n'
              : statusUpdate?.status === 'ERROR'
              ? 'Ocorreu um erro para baixar o app atualizado. \n Feche e abra a aplicação.\n'
              : 'Verificando atualizações'
          }
          color="black"
          type="subtitle"
        />
        {(statusUpdate?.status === 'VERIFY' ||
          statusUpdate?.status === 'CHEKING' ||
          statusUpdate?.status === 'IN-PROGRESS') && (
          <ActivityIndicator
            style={styles.activityIndicator}
            size="large"
            color="#ff9000"
          />
        )}
        {statusUpdate?.status === 'NOT-UPDATED' && (
          <Button value="Baixar" onPress={closeModalUpdated} />
        )}
        {statusUpdate?.status === 'ERROR' && (
          <Button value="Fechar" onPress={closeModalExit} />
        )}
      </Modal>
      <ModalError
        isVisible={isVisibleModalError}
        message={errorMessage}
        closeModal={closeModalError}
      />
    </Scaffold>
  );
};

export default memo(HomeScreen);

const styles = StyleSheet.create({
  textModal: {
    textAlign: 'center',
    marginBottom: 16,
  },
  alignText: {
    textAlign: 'center',
  },
  activityIndicator: {
    marginTop: 8,
  },
});
