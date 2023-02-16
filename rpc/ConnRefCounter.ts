import { getOrInit } from "../util/mod.ts"
import { RpcConn, RpcConnCtor } from "./conn/mod.ts"
import { RpcHandler } from "./messages.ts"

export class ConnRefCounter<D> {
  conns = new Map<D, RpcConn>()

  constructor(readonly connCtor: RpcConnCtor<D>) {}

  ref(discovery: D, handler: RpcHandler, signal: AbortSignal) {
    const conn = getOrInit(this.conns, discovery, () => new this.connCtor(discovery))
    const references = conn.references.get(handler)
    if (!references) conn.references.set(handler, 1)
    else conn.references.set(handler, references + 1)
    signal.addEventListener("abort", () => {
      const references = conn.references.get(handler)!
      conn.references.set(handler, references - 1)
      if (references === 1) {
        conn.references.delete(handler)
        if (!conn.references.size) {
          this.conns.delete(discovery)
          conn.close()
        }
      }
    })
    return conn
  }
}
