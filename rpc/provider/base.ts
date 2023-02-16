import { getOrInit } from "../../util/mod.ts"
import { RpcHandler, RpcMessageId } from "../messages.ts"

export class RpcProvider<D, I = any> {
  conns = new Map<D, RpcConn<I>>()

  constructor(readonly init: (discovery: D) => RpcConn<I>) {}

  ref(discovery: D, handler: RpcHandler, signal: AbortSignal) {
    const conn = getOrInit(this.conns, discovery, () => this.init(discovery))
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

export abstract class RpcConn<I> {
  currentId = 0
  references = new Map<RpcHandler, number>()

  abstract inner: I

  abstract close(): void
  abstract send(id: RpcMessageId, method: string, params: unknown): void
  abstract ready(): Promise<void>
}
