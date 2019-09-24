import { TxiosRequestConfig, TxiosPromise, Method, TxiosResponse, ResolvedFn, RejectedFn } from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './interceptorManager'

interface Interceptors {
  request: InterceptorManager<TxiosRequestConfig>
  response: InterceptorManager<TxiosResponse>
}

interface PromiseChain {
  resolved: ResolvedFn | ((config: TxiosRequestConfig) => TxiosPromise)
  rejected?: RejectedFn
}

export default class Txios {
  interceptors: Interceptors

  constructor() {
    this.interceptors = {
      request: new InterceptorManager<TxiosRequestConfig>(),
      response: new InterceptorManager<TxiosResponse>()
    }
  }

  request(url: any, config?: any): TxiosPromise {
    if (typeof url === 'string') {
      config = config || {}
      config.url = url
    } else {
      config = url
    }

    const chain: PromiseChain[] = [{
      resolved: dispatchRequest,
      rejected: undefined
    }]

    // 对于请求拦截器，先注册的后处理
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })

    // 对于响应拦截器，先注册的先处理
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    let promise = Promise.resolve(config)

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
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




