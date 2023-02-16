import { RpcClientError } from "../errors.ts"
import { RpcEgressMessage, RpcMessageId } from "../messages.ts"
import { RpcConn, RpcProvider } from "./base.ts"

export const wsRpcProvider = new RpcProvider((discovery: string) => new WsRpcConn(discovery))

export class WsRpcConn extends RpcConn<WebSocket> {
  inner

  constructor(readonly discovery: string) {
    super()
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
