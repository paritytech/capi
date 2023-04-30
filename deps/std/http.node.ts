export * from "https://deno.land/std@0.185.0/http/mod.ts"
import { type serve as _serve } from "https://deno.land/std@0.185.0/http/mod.ts"
import * as http from "node:http"
import * as stream from "node:stream"

export const serve: typeof _serve = (handler, options = {}) => {
  return new Promise((resolve) => {
    const server = http.createServer(
      async (req: http.IncomingMessage, res: http.ServerResponse) => {
        const request = convertRequest(req)
        const response = await handler(request, null!)
        for (const [key, value] of response.headers) {
          res.setHeader(key, value)
        }
        res.statusCode = response.status
        res.statusMessage = response.statusText
        if (response.body) {
          response.body.pipeTo(stream.Writable.toWeb(res))
        } else {
          res.end()
        }
      },
    )
    server.on("upgrade", (req: any, socket: any, head: any) => {
      const request = convertRequest(req)
      ;(request as any)._upgrade = [req, socket, head]
      handler(request, null!)
    })
    server.listen(options.port ?? 8000, options.hostname ?? "0.0.0.0", () => {
      options.onListen?.({} as any)
    })
    options.signal?.addEventListener("abort", () => {
      server.close(() => resolve)
    })
  })
}

function convertRequest(req: http.IncomingMessage) {
  const request = new Request(new URL(req.url!, "http://_/"), {
    method: req.method,
    headers: req.headers as any,
    body: req.method === "GET" || req.method === "HEAD"
      ? undefined
      : stream.Readable.toWeb(req) as ReadableStream<Uint8Array>,
    // @ts-ignore https://github.com/nodejs/undici#requestduplex
    duplex: "half",
  })
  return request
}

export async function upgradeWebSocket(request: Request) {
  return Deno.upgradeWebSocket(request)
}
