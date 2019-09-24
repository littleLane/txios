export interface Txios {
  request<T = any>(config: TxiosRequestConfig): TxiosPromise<T>;

  get<T = any>(url: string, config?: TxiosRequestConfig): TxiosPromise<T>;
  delete<T = any>(url: string, config?: TxiosRequestConfig): TxiosPromise<T>;
  head<T = any>(url: string, config?: TxiosRequestConfig): TxiosPromise<T>;
  options<T = any>(url: string, config?: TxiosRequestConfig): TxiosPromise<T>;

  post<T = any>(url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise<T>;
  put<T = any>(url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise<T>;
  patch<T = any>(url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise<T>;
}

export interface TxiosInstance extends Txios {
  <T = any>(config: TxiosRequestConfig): TxiosPromise<T>;
  <T = any>(url: string, config?: TxiosRequestConfig): TxiosPromise<T>;
}

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

export interface TxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: TxiosRequestConfig;
  request: any;
}

export interface TxiosPromise<T= any> extends Promise<TxiosResponse<T>> {}

export interface TxiosError extends Error {
  config: TxiosRequestConfig;
  code?: string | null;
  request: any;
  response: TxiosResponse;
  isTxiosError: boolean;
}
