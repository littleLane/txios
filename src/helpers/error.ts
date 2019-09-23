import { TxiosRequestConfig, TxiosResponse } from '../types'

export class TxiosError extends Error {
  isTxiosError: boolean
  config: TxiosRequestConfig
  code?: string | null
  request?: any
  response?: TxiosResponse


  constructor(
    message: string,
    config: TxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: TxiosResponse
  ) {
    super(message)

    this.isTxiosError = true
    this.config = config
    this.code = code
    this.request = request
    this.response = response

    // 解决 TypeScript 继承一些内置对象的时候的坑
    // 参考：https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, TxiosError.prototype)
  }
}

export function createError(
  message: string,
  config: TxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: TxiosResponse
): TxiosError {
  return new TxiosError(message, config, code, request, response)
}
