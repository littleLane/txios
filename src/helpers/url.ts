import { isType, encodeString, isURLSearchParams } from './util'

interface URLOrigin {
  protocol: string;
  host: string;
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)

  return (
    parsedOrigin.protocol === currentOrigin.protocol &&
    parsedOrigin.host === currentOrigin.host
  )
}

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)

  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}

export function buildUrl(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
) {
  if (!params) {
    return url
  }

  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const queryParts: string[] = []

    // 处理 params 参数
    Object.keys(params).forEach((key: string) => {
      const val = params[key]

      // 排除 value 为 null 或 undefined 的部分
      if (val === null || typeof val === 'undefined') {
        return
      }

      let values: string[] = []

      // 统一将参数 value 处理成数组的形式
      // 针对 value 为数组的情况，将 key 设置为 key[]
      if (Array.isArray(val)) {
        values = val
        key += '[]'
      } else {
        values = [val]
      }

      // 处理生成的 value 数组，date 类型转 toISOString，对象统一 JSON.stringify
      values.forEach((value: any) => {
        if (isType(value, 'date')) {
          value = value.toISOString()
        } else if (isType(value, 'object')) {
          value = JSON.stringify(value)
        }

        queryParts.push(`${encodeString(key)}=${encodeString(value)}`)
      })
    })

    // 参数数组转字符串
    serializedParams = queryParts.join('&')
  }


  // 处理 hash，拼接参数
  if (serializedParams) {
    const markIndex = url.indexOf('#')

    if (markIndex > -1) {
      url = url.slice(0, markIndex)
    }

    url = (url.includes('?') ? '&' : '?') + serializedParams
  }

  return url
}

export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}
