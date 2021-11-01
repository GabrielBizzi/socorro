import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  IValidateAddress,
  IProduct,
  IValidateProduct,
  IGetAddressSuggestion,
  IAuthenticated,
} from './interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
  validateStatus: () => true,
});

const isAuthenticated = async () => {
  const expiration = await AsyncStorage.getItem('expiration');
  const currentTime = new Date().toString();
  const isExpired = parseInt(String(expiration), 10) <= Date.parse(currentTime);
  // const exp = new Date(parseInt(expiration, 10));
  // console.log({ exp, currentTime, isExpired });
  if (isExpired) {
    const reauthenticate = await updateAuthentication();
    console.log({ reauthenticate });
    return reauthenticate;
  }
  return true;
};
const updateAuthentication = async () => {
  const login = await AsyncStorage.getItem('login');
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  const url = await AsyncStorage.getItem('url');
  return await api
    .post(`${url}/Autenticacao/Refresh-Token`, {
      login,
      refreshToken,
    })
    .then(async (response) => {
      await AsyncStorage.setItem(
        'expiration',
        Date.parse(response.data.expiration).toString(),
      );
      console.log(
        response.data.expiration,
        Date.parse(response.data.expiration).toString(),
      );
      await AsyncStorage.setItem('accessToken', response.data.accessToken);
      return true;
    })
    .catch((err) => {
      console.log({ err });
      return false;
    });
};

export const getTokenInformation = async (
  refreshToken: string,
  url: string,
) => {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return false;
  }
  return await api
    .get(`${url}/Autenticacao`, { params: { refreshToken } })
    .then((response: AxiosResponse<IAuthenticated>) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      return error;
    });
};

export const hasAddressSuggestion = async (CodigoCliente: string | number) => {
  const params = {
    CodigoCliente,
    Chave: 'SUGERIR_ENDERECO',
  };
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return 'Falha na autenticação';
  }
  const accessToken = await AsyncStorage.getItem('accessToken');
  const url = await AsyncStorage.getItem('url');
  return await api
    .get(`${url}/ParametroGenerico`, {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response: any) => {
      return response.data === 'S' ? true : false;
    })
    .catch((err: Error) => {
      return err;
    });
};
export const isValidAddress = async (params: IValidateAddress) => {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return 'Falha na autenticação';
  }
  const accessToken = await AsyncStorage.getItem('accessToken');
  const url = await AsyncStorage.getItem('url');
  return await api
    .get(`${url}/ValidarEndereco`, {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response: any) => {
      let isValid = true;
      if (response.data.badRequest) {
        isValid = false;
      }
      if (response.status !== 200) {
        isValid = false;
      }
      return {
        isValid,
        ...response.data,
      };
    })
    .catch((error: Error) => {
      return {
        isValid: false,
        message: error.message,
      };
    });
};

export const saveProducts = async (params: IProduct) => {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return 'Falha na autenticação';
  }
  const accessToken = await AsyncStorage.getItem('accessToken');
  const url = await AsyncStorage.getItem('url');
  return await api
    .post(
      `${url}/ArmazenagemProduto`,
      {
        ...params,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    )
    .then((response: any) => {
      let isValid = true;
      if (response.data.badRequest) {
        isValid = false;
      }
      if (response.status !== 200) {
        isValid = false;
      }
      return {
        isValid,
        ...response.data,
      };
    })
    .catch((error: Error) => {
      return error;
    });
};

export const isValidProduct = async (params: IValidateProduct) => {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return 'Falha na autenticação';
  }
  const accessToken = await AsyncStorage.getItem('accessToken');
  const url = await AsyncStorage.getItem('url');
  return await api
    .get(`${url}/ValidarProduto`, {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response: any) => {
      let isValid = true;
      if (response.data.badRequest) {
        isValid = false;
      }
      if (response.status !== 200) {
        isValid = false;
      }
      return {
        isValid,
        ...response.data,
      };
    })
    .catch((error: Error) => {
      return error;
    });
};
export const getAddressSuggestion = async (params: IProduct) => {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return 'Falha na autenticação';
  }
  const accessToken = await AsyncStorage.getItem('accessToken');
  const url = await AsyncStorage.getItem('url');
  return await api
    .get(`${url}/SugestaoEndereco`, {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response: any): IGetAddressSuggestion => {
      let isValid = true;
      if (response.data.badRequest) {
        isValid = false;
      }
      if (response.status !== 200) {
        isValid = false;
      }
      if (!response.data) {
        isValid = false;
      }
      return {
        isValid,
        address: response.data,
      };
    })
    .catch((error: Error): IGetAddressSuggestion => {
      return {
        isValid: false,
        message: error.message,
      };
    });
};
