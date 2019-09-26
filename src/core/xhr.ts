import { TxiosRequestConfig, TxiosResponse, TxiosPromise } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'

export default function xhr(config: TxiosRequestConfig): TxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'get',
      data = null,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
    } = config

    const xhrequest = new XMLHttpRequest()

    // 开启一个链接
    xhrequest.open(method.toUpperCase(), url!, true)

    configureRequest()

    addEvents()

    processHeaders()

    processCancel()

    // 发送请求
    xhrequest.send(data)

    // 配置参数
    function configureRequest(): void {
      // 响应数据类型
      if (responseType) {
        xhrequest.responseType = responseType
      }

      // 请求超时处理
      if (timeout) {
        xhrequest.timeout = timeout;
      }

      // cookie 凭证
      if (withCredentials) {
        xhrequest.withCredentials = true
      }
    }

    // 监听事件
    function addEvents(): void {
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

      xhrequest.ontimeout = function() {
        reject(createError(
          `Timeout of ${timeout} ms exceeded`,
          config,
          'ECONNABORTED',
          xhrequest
        ))
      }

      if (typeof onDownloadProgress === 'function') {
        xhrequest.onprogress = onDownloadProgress
      }

      if (typeof onUploadProgress === 'function') {
        xhrequest.upload.onprogress = onUploadProgress
      }
    }

    // 请求头处理
    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)

        if (xsrfValue) {
          headers[xsrfHeaderName!] = xsrfValue
        }
      }

      // 设置请求头
      Object.keys(headers).forEach((key: string) => {
        if (data === null && key.toLowerCase() === 'content-type') {
          delete headers[key]
        } else {
          xhrequest.setRequestHeader(key, headers[key])
        }
      })
    }

    // 取消请求
    function processCancel(): void {
      if (cancelToken) {
        // tslint:disable-next-line: no-floating-promises
        cancelToken.promise.then(reason => {
          xhrequest.abort()
          reject(reason)
        })
      }
    }

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
  })
}


