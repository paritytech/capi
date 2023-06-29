// @ts-nocheck

import * as tsNode from "./ts-node.ts"

let inner = undefined

export function globalPreload({ port }) {
  port.once("message", function handler(msg: any) {
    if (msg === "__capi_enableTsLoader") {
      if (!inner) inner = tsNode.createEsmHooks(tsNode.create())
      port.postMessage("__capi_enableTsLoader")
    }
  })
  return `
globalThis.__capi_enableTsLoader = () => new Promise(res => {
  port.postMessage("__capi_enableTsLoader")
  port.once("message", (msg) => {
    if(msg === "__capi_enableTsLoader") {
      res()
    }
  })
})
`
}

export function load(a, b, cont) {
  if (inner) return inner.load(a, b, cont)
  return cont(a, b)
}

export function resolve(a, b, cont) {
  if (inner) return inner.resolve(a, b, cont)
  return cont(a, b)
}
