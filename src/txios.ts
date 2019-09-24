import { TxiosInstance, TxiosRequestConfig } from "./types";
import Txios from "./core/txios";
import { extend } from "./helpers/util";
import defaults from './defaults'

function createInstance(config: TxiosRequestConfig): TxiosInstance {
  const context = new Txios(config)
  const instance = Txios.prototype.request.bind(context)

  extend(instance, context)

  return instance as TxiosInstance
}

const txios = createInstance(defaults)

export default txios
