import { TxiosRequestConfig, TxiosStatic } from "./types";
import Txios from "./core/txios";
import { extend } from "./helpers/util";
import defaults from './defaults'
import mergeConfig from "./core/mergeConfig";
import CancelToken from "./cancel/CancelToken";
import Cancel, { isCancel } from "./cancel/Cancel";

function createInstance(config: TxiosRequestConfig): TxiosStatic {
  const context = new Txios(config)
  const instance = Txios.prototype.request.bind(context)

  extend(instance, context)

  return instance as TxiosStatic
}

const txios = createInstance(defaults)

txios.create = function create(config: TxiosRequestConfig) {
  return createInstance(mergeConfig(defaults, config))
}

txios.CancelToken = CancelToken
txios.Cancel = Cancel
txios.isCancel = isCancel

txios.all = function all(promises) {
  return Promise.all(promises)
}

txios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

export default txios
