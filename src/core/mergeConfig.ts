import { TxiosRequestConfig } from "../types";
import { isPlainObject, deepMerge } from "../helpers/util";

// 默认的合并器
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 特殊字段的合并器
const strats: any = {}

// 针对 url、params、data
const stratKeysFromVal2 = ['url', 'params', 'data']

function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

// 针对 headers 字段的合并器
const stratKeysDeepMerge = ['headers']

function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if(typeof val1 !== 'undefined') {
    return val1
  }
}

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

/**
 * 合并配置
 * @param config1 默认配置
 * @param config2 自定义配置
 */
export default function mergeConfig(
  config1: TxiosRequestConfig,
  config2: TxiosRequestConfig
): TxiosRequestConfig {
  if (!config2) {
    return config1
  }

  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2[key])
  }

  return config
}
