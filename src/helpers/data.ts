import { isType } from './util'

/**
 * 转换 data
 * @param data
 */
export function transformRequest(data: any): any {
  if (isType(data, 'object')) {
    return JSON.stringify(data)
  }

  return data
}

export function transformResponse(data: any): any {
  if (isType(data, 'string')) {
    try {
      data = JSON.parse(data)
    } catch (error) {}
  }

  return data
}
