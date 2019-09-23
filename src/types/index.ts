export type Method =
  'get' | 'GET' |
  'post' | 'POST' |
  'put' | 'PUT' |
  'head' | 'HEAD' |
  'delete' | 'DELETE' |
  'options' | 'OPTIONS' |
  'patch' | 'PATCH'

export interface TxiosRequestConfig {
  url: string;
  method?: Method;
  data?: any;
  params?: any;
  headers?: any;
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
}

export interface TxiosResponse {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: TxiosRequestConfig;
  request: any;
}

export interface TxiosPromise extends Promise<TxiosResponse> {}

export interface TxiosError extends Error {
  config: TxiosRequestConfig;
  code?: string | null;
  request: any;
  response: TxiosResponse;
  isTxiosError: boolean;
}
