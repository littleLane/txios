import { TxiosTransformer } from "../types";

export default function transform(
  data: any,
  headers: any,
  fns?: TxiosTransformer | TxiosTransformer[]
): any {
  if (!fns) {
    return data
  }

  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  fns.forEach(fn => {
    data = fn(data, Headers)
  })

  return data
}
