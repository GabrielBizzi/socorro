import base64 from 'react-native-base64';

export interface ISerializedParams {
  codeUser: number;
  codigoFilial: number;
  diretorio: string;
  enableCamera: number;
  refreshToken: string;
  expiration: number;
  style: string;
  url: string;
  versaoMaior: number;
  versaoMenor: number;
}

export function deserialize(params: string) {
  const data = JSON.parse(base64.decode(params));

  return data;
}
