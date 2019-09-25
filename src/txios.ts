import { TxiosRequestConfig, TxiosStatic } from "./types";
import Txios from "./core/txios";
import { extend } from "./helpers/util";
import defaults from './defaults'
import mergeConfig from "./core/mergeConfig";

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

export default txios
