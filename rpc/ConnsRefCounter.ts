import { getOrInit } from "../util/mod.ts"
import { RpcConn, RpcConnCtor } from "./conn/mod.ts"
import { RpcHandler } from "./rpc_common.ts"

export class ConnsRefCounter<D> {
  conns = new Map<D, RpcConn>()

  constructor(readonly connCtor: RpcConnCtor<D>) {}

  ref(discoveryValue: D, handler: RpcHandler, signal: AbortSignal) {
    const conn = getOrInit(this.conns, discoveryValue, () => new this.connCtor(discoveryValue))
    const references = conn.handlerReferenceCount.get(handler)
    if (!references) conn.handlerReferenceCount.set(handler, 1)
    else conn.handlerReferenceCount.set(handler, references + 1)
    signal.addEventListener("abort", () => {
      const references = conn.handlerReferenceCount.get(handler)!
      conn.handlerReferenceCount.set(handler, references - 1)
      if (references === 1) {
        conn.handlerReferenceCount.delete(handler)
        if (!conn.handlerReferenceCount.size) {
          this.conns.delete(discoveryValue)
          conn.close()
        }
      }
    })
    return conn
  }
}
