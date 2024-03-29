import { TxiosRequestConfig, TxiosPromise, TxiosResponse } from "../types";
import { buildUrl, isAbsoluteURL, combineURL } from '../helpers/url'
import { transformRequest } from '../helpers/data'
import { processHeaders, flattenHeaders } from '../helpers/headers'
import xhr from './xhr'
import transform from "./transform";

export default function dispatchRequest(config: TxiosRequestConfig): TxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(res => transformResponseData(res))
}

// 处理 request he response 配置参数
function processConfig(config: TxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

// 处理请求路径
export function transformUrl(config: TxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config

  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url);
  }

  return buildUrl(url!, params, paramsSerializer)
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
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: TxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
