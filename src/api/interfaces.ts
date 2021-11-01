interface IResponse {
  badRequest?: boolean;
  message?: string;
  isValid: boolean;
}

export interface IValidateAddress {
  CodigoCliente: number;
  Endereco: string;
}

export interface IAddressValidateResponse extends IResponse {}

export interface IProduct {
  CodigoCliente: number;
  DescricaoEndereco?: string;
  EAN: string | number;
  User?: number;
}
export interface IValidateProduct {
  CodigoCliente: number;
  Produto: string;
}
export interface IGetAddressSuggestion extends IResponse {
  address?: string;
}
export interface IAuthenticated {
  accessToken: string;
  codigoUsuario: number;
  login: string;
  nome: string;
  email: string;
  ativo: true;
  alterarSenha: false;
  codigoPerfil: number;
  descricaoPerfil: string;
  lider: true;
  clientes: {
    descricaoCliente: string;
  }[];
  usuInc: number;
  datInc: string;
  usuAlt: number;
  datAlt: string;
}
