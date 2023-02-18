import { getOrInit } from "../util/mod.ts"
import { RpcConn, RpcConnCtor } from "./conn/mod.ts"
import { RpcHandler } from "./rpc_common.ts"

export class ConnsRefCounter<D> {
  conns = new Map<D, RpcConn>()

  constructor(readonly connCtor: RpcConnCtor<D>) {}

  ref(discoveryValue: D, handler: RpcHandler, signal: AbortSignal) {
    const conn = getOrInit(this.conns, discoveryValue, () => new this.connCtor(discoveryValue))
    const references = conn.handlerReferenceCounts.get(handler)
    if (!references) conn.handlerReferenceCounts.set(handler, 1)
    else conn.handlerReferenceCounts.set(handler, references + 1)
    signal.addEventListener("abort", () => {
      const references = conn.handlerReferenceCounts.get(handler)!
      conn.handlerReferenceCounts.set(handler, references - 1)
      if (references === 1) {
        conn.handlerReferenceCounts.delete(handler)
        if (!conn.handlerReferenceCounts.size) {
          this.conns.delete(discoveryValue)
          conn.close()
        }
      }
    })
    return conn
  }
}
