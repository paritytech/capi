import { Connection } from "./Connection.ts"
import { ConnectionError, RpcEgressMessage } from "./rpc_messages.ts"

export class WsConnection extends Connection {
  ws

  constructor(readonly url: string) {
    super()
    this.ws = new WebSocket(url)
    this.ws.addEventListener("message", (e) => {
      this.handle(JSON.parse(e.data))
    }, { signal: this.signal })
    this.ws.addEventListener("error", (e) => {
      console.error(e)
      throw new Error("TODO: more graceful error messaging / recovery")
    }, { signal: this.signal })
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
            this.ws.addEventListener("close", abort, controller)
            this.ws.addEventListener("error", abort, controller)

            function abort() {
              controller.abort()
              reject()
            }
          })
        } catch {
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

  async close() {
    switch (this.ws.readyState) {
      case WebSocket.OPEN: {
        this.ws.close()
        break
      }
      case WebSocket.CONNECTING: {
        const controller = new AbortController()
        const options: AddEventListenerOptions = {
          signal: controller.signal,
          once: true,
        }
        this.ws.addEventListener("open", () => {
          this.ws.close()
          controller.abort()
        }, options)
        this.ws.addEventListener("error", () => {
          throw new ConnectionError("Error occurred during CONNECTING")
        }, options)
        break
      }
    }
  }
}
