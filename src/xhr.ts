import { TxiosRequestConfig, TxiosResponse, TxiosPromise } from './types'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: TxiosRequestConfig): TxiosPromise {
  return new Promise((resolve) => {
    const { url, method = 'get', data = null, headers, responseType } = config

    const xhrequest = new XMLHttpRequest()

    if (responseType) {
      xhrequest.responseType = responseType
    }

    xhrequest.open(method.toUpperCase(), url, true)
    xhrequest.onreadystatechange = function handleLoad() {
      if (xhrequest.readyState !== 4) {
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

      resolve(response)
    }

    Object.keys(headers).forEach((key: string) => {
      if (data === null && key.toLowerCase() === 'content-type') {
        delete headers[key]
      } else {
        xhrequest.setRequestHeader(key, headers[key])
      }
    })

    xhrequest.send(data)
  })
}
