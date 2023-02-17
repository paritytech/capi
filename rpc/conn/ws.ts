import { RpcClientError, RpcEgressMessage, RpcMessageId } from "../rpc_common.ts"
import { RpcConn } from "./base.ts"

export class WsRpcConn extends RpcConn {
  chain

  constructor(readonly url: string) {
    super()
    this.chain = new WebSocket(url)
    this.chain.addEventListener("message", (e) => {
      const message = JSON.parse(e.data)
      for (const handler of this.handlerReferenceCount.keys()) handler(message)
    })
  }

  async ready() {
    switch (this.chain.readyState) {
      case WebSocket.OPEN:
        return
      case WebSocket.CONNECTING: {
        try {
          return await new Promise<void>((resolve, reject) => {
            const controller = new AbortController()
            this.chain.addEventListener("open", () => {
              controller.abort()
              resolve()
            }, controller)
            this.chain.addEventListener("close", () => {
              controller.abort()
              reject()
            }, controller)
            this.chain.addEventListener("error", () => {
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

  send(id: RpcMessageId, method: string, params: unknown[]) {
    this.chain.send(RpcEgressMessage.fmt(id, method, params))
  }

  close() {
    this.chain.close()
  }
}
