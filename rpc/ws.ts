import { Connection } from "./Connection.ts"
import { RpcClientError, RpcEgressMessage, RpcMessageId } from "./rpc_common.ts"

export class WsConnection extends Connection {
  chain

  constructor(readonly url: string) {
    super()
    this.chain = new WebSocket(url)
    this.chain.addEventListener("message", (e) => this.handle(JSON.parse(e.data)))
    this.chain.addEventListener("error", (e) => { // TODO: recovery
      console.log(e)
      Deno.exit(1)
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
            this.chain.addEventListener("close", throw_, controller)
            this.chain.addEventListener("error", throw_, controller)

            function throw_() {
              controller.abort()
              reject()
            }
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
