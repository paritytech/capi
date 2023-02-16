import { getOrInit, SignalBearer } from "../util/mod.ts"
import { RpcEgressMessage, RpcHandler, RpcMessageId } from "./rpc_messages.ts"
import { RpcClientError } from "./RpcClientError.ts"

export class WsRpcProvider {
  conns = new Map<string, WsRpcConn>()

  ref(discovery: string, handler: RpcHandler, { signal }: SignalBearer) {
    const conn = getOrInit(this.conns, discovery, () => new WsRpcConn(discovery))
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

export const wsRpcProvider = new WsRpcProvider()

export class WsRpcConn {
  currentId = 0
  references = new Map<RpcHandler, number>()
  inner

  constructor(readonly discovery: string) {
    this.inner = new WebSocket(discovery)
    this.inner.addEventListener("message", (e) => {
      const message = JSON.parse(e.data)
      for (const reference of this.references.keys()) reference(message)
    })
  }

  close() {
    this.inner.close()
  }

  send(id: RpcMessageId, method: string, params: unknown[]) {
    const message: RpcEgressMessage = {
      jsonrpc: "2.0",
      id,
      method,
      params,
    }
    this.inner.send(JSON.stringify(message))
  }

  async ready() {
    switch (this.inner.readyState) {
      case WebSocket.OPEN:
        return
      case WebSocket.CONNECTING: {
        try {
          return await new Promise<void>((resolve, reject) => {
            const controller = new AbortController()
            this.inner.addEventListener("open", () => {
              controller.abort()
              resolve()
            }, controller)
            this.inner.addEventListener("close", () => {
              controller.abort()
              reject()
            }, controller)
            this.inner.addEventListener("error", () => {
              controller.abort()
              reject()
            }, controller)
          })
        } catch (_e) {
          throw new RpcClientError()
        }
      }
      case WebSocket.CLOSING:
      case WebSocket.CLOSED: {
        throw new RpcClientError()
      }
    }
  }
}
