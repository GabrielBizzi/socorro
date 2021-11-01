import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  HomeScreen: {
    token: string;
    address?: string;
  };
  CameraScreen: {
    origin: 'StorageScreen' | 'QueryScreen' | 'AddressScreen';
    input: 'address' | 'ua';
  };
  ProductWithoutSuggestions: {
    address: string;
    input: string;
    order?: string;
  };
  AddressWithoutSuggestions: {};
  ProductWithSuggestion: {
    order?: string;
    codeFilial: string;
    diretorio?: string;
    codeUsuario?: number;
    style?: string;
    enableCamera?: string;
    url?: string;
    versaoMaior?: string;
    versaoMenor?: string;
    pathApk?: string;
    input: string;
  };
  AddressWithSuggestions: {
    order?: string;
    codeFilial: string;
    diretorio?: string;
    codeUsuario?: number;
    style?: string;
    enableCamera?: string;
    url?: string;
    versaoMaior?: string;
    versaoMenor?: string;
    pathApk?: string;
    input: string;
    product: string;
    address: string;
  };
};

export type RootStackRouteProps<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;
