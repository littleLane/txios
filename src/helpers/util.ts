/**
 * 用于判断是否为什么类型的数据
 * @param data 数据
 * @param type 类型
 */
export const isType = (data: any, type: string): boolean => {
  const dataType = Object.prototype.toString.call(data)
    .replace(/\[object\W|\]/g, '')
    .toLowerCase()

  return type === dataType
}

/**
 * 用于判断是否为对象
 * @param data
 */
export const isObject = (data: any): boolean => {
  return data && typeof data === 'object'
}

/**
 * 编码数据
 * @param data
 */
export const encodeString = (data: string): string => {
  return encodeURIComponent(data)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
