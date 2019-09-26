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
  url?: string;
  method?: Method;
  data?: any;
  params?: any;
  headers?: any;
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
  [propName: string]: any;
  transformRequest?: TxiosTransformer | TxiosTransformer[];
  transformResponse?: TxiosTransformer | TxiosTransformer[];
  cancelToken?: CancelToken;
  withCredentials?: boolean;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onDownloadProgress?: (e: ProgressEvent) => void;
  onUploadProgress?: (e: ProgressEvent) => void;
  auth?: AxiosBasicCredentials;
  validateStatus(status: number): boolean;
}

export interface AxiosBasicCredentials {
  username: string;
  password: string;
}

export interface TxiosTransformer {
  (data?: any, headers?: any): any
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

export interface TxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number;

  eject(id: number): void;
}

export interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface TxiosStatic extends TxiosInstance {
  create(config?: TxiosRequestConfig): TxiosInstance;

  CancelToken: CancelTokenStatic;
  Cancel: CancelStatic;
  isCancel: (value: any) => boolean;
}

// 请求取消
export interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;

  throwIfRequested(): void;
}

export interface Canceler {
  (message?: string): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken;
  cancel: Canceler;
}

export interface CancelTokenStatic {
  new(excutor: CancelExecutor): CancelToken;
  source(): CancelTokenSource;
}

export interface Cancel {
  message?: string;
}

export interface CancelStatic {
  new(message?: string): Cancel
}
