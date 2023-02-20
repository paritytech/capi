import { Connection } from "./Connection.ts"
import { ConnectionError, RpcEgressMessage } from "./rpc_messages.ts"

export class WsConnection extends Connection {
  ws

  constructor(readonly url: string) {
    super()
    this.ws = new WebSocket(url)
    this.ws.addEventListener("message", (e) => this.handle(JSON.parse(e.data)))
    this.ws.addEventListener("error", (e) => { // TODO: recovery
      console.log(e)
      Deno.exit(1)
    })
  }

  async ready() {
    switch (this.ws.readyState) {
      case WebSocket.OPEN:
        return
      case WebSocket.CONNECTING: {
        try {
          return await new Promise<void>((resolve, reject) => {
            const controller = new AbortController()
            this.ws.addEventListener("open", () => {
              controller.abort()
              resolve()
            }, controller)
            this.ws.addEventListener("close", throw_, controller)
            this.ws.addEventListener("error", throw_, controller)

            function throw_() {
              controller.abort()
              reject()
            }
          })
        } catch (_e) {
          throw new ConnectionError()
        }
      }
      case WebSocket.CLOSING:
      case WebSocket.CLOSED: {
        throw new ConnectionError("WebSocket already closed")
      }
    }
  }

  send(id: number, method: string, params: unknown[]) {
    this.ws.send(RpcEgressMessage.fmt(id, method, params))
  }

  close() {
    this.ws.close()
  }
}
