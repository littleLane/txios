import { TxiosRequestConfig, TxiosPromise, TxiosResponse } from './types'
import { buildUrl } from './helpers/url'
import { transformRequest, transformResponse } from './helpers/data'
import { processHeaders } from './helpers/headers'
import xhr from './xhr'

export default function axios(config: TxiosRequestConfig): TxiosPromise {
  processConfig(config)
  return xhr(config).then(res => transformResponseData(res))
}

// 处理 request he response 配置参数
function processConfig(config: TxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

// 处理请求路径
function transformUrl(config: TxiosRequestConfig): string {
  const { url, params } = config
  return buildUrl(url, params)
}

// 处理请求参数
function transformRequestData(config: TxiosRequestConfig): any {
  return transformRequest(config.data)
}

// 转换请求头
function transformHeaders(config: TxiosRequestConfig): any {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

// 转换响应数据
function transformResponseData(res: TxiosResponse): TxiosResponse {
  res.data = transformResponse(res.data)
  return res
}
