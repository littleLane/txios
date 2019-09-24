import { TxiosRequestConfig, TxiosPromise, Method } from '../types'
import dispatchRequest from './dispatchRequest'

export default class Txios {
  request(url: any, config?: any): TxiosPromise {
    if (typeof url === 'string') {
      config = config || {}
      config.url = url
    } else {
      config = url
    }

    return dispatchRequest(config)
  }

  get(url: string, config?: TxiosRequestConfig): TxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config?: TxiosRequestConfig): TxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config?: TxiosRequestConfig): TxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config?: TxiosRequestConfig): TxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  _requestMethodWithoutData(method: Method, url: string, config?: TxiosRequestConfig): TxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }

  _requestMethodWithData(method: Method, url: string, data?: any, config?: TxiosRequestConfig): TxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}




