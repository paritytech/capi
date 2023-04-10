export function upgradeWebSocket(request: Request) {
  const { response, socket } = Deno.upgradeWebSocket(request)
  return { socket: Promise.resolve(socket), response: Promise.resolve(response) }
}
