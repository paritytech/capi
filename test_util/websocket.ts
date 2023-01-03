interface CreateWebSocketServerProps {
  port?: number
  onMessage?: WebSocket["onmessage"]
}

export function createWebSocketServer({ port, onMessage }: CreateWebSocketServerProps = {}) {
  const onmessage = onMessage ?? (() => {})
  const listener = Deno.listen({ port: port ?? 0 })
  ;(async () => {
    for await (const conn of listener) {
      for await (const e of Deno.serveHttp(conn)) {
        const { socket, response } = Deno.upgradeWebSocket(e.request)
        socket.onmessage = onmessage
        e.respondWith(response)
      }
    }
  })()
  return {
    close: () => listener.close(),
    url: `ws://localhost:${(listener.addr as Deno.NetAddr).port}`,
  }
}
