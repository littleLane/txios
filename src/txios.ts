import { TxiosInstance } from "./types";
import Txios from "./core/txios";
import { extend } from "./helpers/util";

function createInstance(): TxiosInstance {
  const context = new Txios()
  const instance = Txios.prototype.request.bind(context)

  extend(instance, context)

  return instance as TxiosInstance
}

const txios = createInstance()

export default txios
