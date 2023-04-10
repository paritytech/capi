import * as net from "node:net"

export function getFreePort(): Promise<number> {
  return new Promise((resolve) => {
    const tmp = net.createServer()
    tmp.listen(0, () => {
      const { port } = tmp.address()
      tmp.close(() => {
        resolve(port)
      })
    })
  })
}

export async function portReady(port: number): Promise<void> {
  while (true) {
    try {
      const connection = net.createConnection({ port })
      await new Promise<void>((resolve, reject) => {
        connection.on("connect", resolve)
        connection.on("error", reject)
      })
      connection.destroy()
      break
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
}
