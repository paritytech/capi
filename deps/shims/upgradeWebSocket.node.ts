import * as WS from "./ws.ts"

let wss: WS.WebSocketServer | undefined

export function upgradeWebSocket(request: Request) {
  wss ??= new WS.WebSocketServer({ noServer: true })
  // Set by http.node.ts
  const [req, socket, head] = (request as any)._upgrade
  return {
    socket: new Promise<WebSocket>((resolve) =>
      wss.handleUpgrade(req, socket, head, (ws: WebSocket) => {
        resolve(ws)
        setTimeout(() => (ws as any).emit("open"), 0)
      })
    ),
    response: new Promise<Response>(() => {}),
  }
}
