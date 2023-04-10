import { WebSocketServer } from "./ws.ts"

const wss = new WebSocketServer({ noServer: true })

export function upgradeWebSocket(request: Request) {
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
