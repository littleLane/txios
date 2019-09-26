import { TxiosRequestConfig, TxiosResponse, TxiosPromise } from './types'
import { parseHeaders } from './helpers/headers'
import { createError } from './helpers/error'

export default function xhr(config: TxiosRequestConfig): TxiosPromise {
  return new Promise((resolve, reject) => {
    const { url, method = 'get', data = null, headers, responseType, timeout, cancelToken } = config

    const xhrequest = new XMLHttpRequest()

    if (responseType) {
      xhrequest.responseType = responseType
    }

    // 开启一个链接
    xhrequest.open(method.toUpperCase(), url!, true)

    // 监听状态变化
    xhrequest.onreadystatechange = function handleLoad() {
      if (xhrequest.readyState !== 4) {
        return
      }

      // 网络出错或者超时
      if (xhrequest.status === 0) {
        return
      }

      const responseHeaders = parseHeaders(xhrequest.getAllResponseHeaders())
      const responseData = responseType && responseType !== 'text' ? xhrequest.response : xhrequest.responseText
      const response: TxiosResponse = {
        data: responseData,
        status: xhrequest.status,
        statusText: xhrequest.statusText,
        headers: responseHeaders,
        config,
        request: xhrequest
      }

      handleResponse(response)
    }

    // 网络错误处理
    xhrequest.onerror = function() {
      reject(createError(
        'Network Error',
        config,
        null,
        xhrequest
      ))
    }

    // 请求超时处理
    if (timeout) {
      xhrequest.timeout = timeout;
    }

    xhrequest.ontimeout = function() {
      reject(createError(
        `Timeout of ${timeout} ms exceeded`,
        config,
        'ECONNABORTED',
        xhrequest
      ))
    }

    // 设置请求头
    Object.keys(headers).forEach((key: string) => {
      if (data === null && key.toLowerCase() === 'content-type') {
        delete headers[key]
      } else {
        xhrequest.setRequestHeader(key, headers[key])
      }
    })

    // 发送请求
    xhrequest.send(data)

    // 处理响应状态
    function handleResponse(response: TxiosResponse) {
      if (response.status >= 200 && response.status < 300 || response.status === 304) {
        resolve(response)
      } else {
        reject(createError(
          `Request failed with status code ${response.status}`,
          config,
          null,
          xhrequest,
          response
        ))
      }
    }

    if (cancelToken) {
      // tslint:disable-next-line: no-floating-promises
      cancelToken.promise.then(reason => {
        xhrequest.abort()
        reject(reason)
      })
    }
  })
}


