import { mime } from "https://deno.land/x/mimetypes@v1.0.0/mod.ts"
import { FrameCodegen } from "../codegen/FrameCodegen.ts"
import { blake2_512, blake2_64 } from "../crypto/hashers.ts"
import { hex } from "../crypto/mod.ts"
import { Handler, Status } from "../deps/std/http.ts"
import { decodeMetadata } from "../frame_metadata/decodeMetadata.ts"
import { $metadata } from "../frame_metadata/raw/v14.ts"
import { CacheBase } from "../util/cache/base.ts"
import { WeakMemo } from "../util/memo.ts"
import { tsFormatter } from "../util/tsFormatter.ts"
import { $codegenSpec, CodegenEntry } from "./codegenSpec.ts"
import * as f from "./factories.ts"

const rCodegenUrl = /^\/([\da-f]{16})(\/.+)?$/
const rUploadUrl = /^\/upload\/(codegen\/[\da-f]{16}|metadata\/[\da-f]{128})$/

const codeTtl = 60_000

export function handler(dataCache: CacheBase, generatedCache: CacheBase): Handler {
  const filesMemo = new WeakMemo<string, Map<string, string>>()
  return handleCors(handleErrors(async (request) => {
    const url = new URL(request.url)
    const { pathname } = url
    if (pathname === "/") return await fetch(import.meta.resolve("./static/index.html"))
    let match
    if ((match = rUploadUrl.exec(pathname))) {
      const key = match[1]!
      return handleUpload(request, key)
    } else if ((match = rCodegenUrl.exec(pathname))) {
      const hash = match[1]!
      const path = match[2] ?? "/"
      return handleCodegen(request, hash, path)
    }
    if (pathname.startsWith("/capi/")) {
      return f.code(generatedCache, request, async () => {
        const url = new URL(pathname.slice(1), import.meta.resolve("../"))
        const response = await fetch(url)
        if (!response.ok) throw f.notFound()
        return response.text()
      })
    }
    const response = await fetch(new URL(pathname.slice(1), import.meta.resolve("./static/")))
    if (!response.ok) return f.notFound()
    return new Response(response.body, {
      headers: {
        "Content-Type": mime.getType(pathname) ?? "text/plain",
      },
    })
  }))

  async function handleUpload(request: Request, key: string) {
    const [kind, untrustedHash] = key.split("/") as ["codegen" | "metadata", string]
    if (request.method === "HEAD") {
      const exists = await dataCache.has(key)
      return new Response(null, { status: exists ? 204 : 404 })
    } else if (request.method === "PUT") {
      if (await dataCache.has(key)) {
        return new Response(null, { status: 204 })
      }
      const untrustedData = new Uint8Array(await request.arrayBuffer())
      const hasher = kind === "codegen" ? blake2_64 : blake2_512
      const codec = kind === "codegen" ? $codegenSpec : $metadata
      let data: Uint8Array
      try {
        const value = codec.decode(untrustedData)
        codec.assert(value)
        data = codec.encode(value as any)
      } catch {
        return new Response("invalid request body data", { status: 400 })
      }
      const hash = hex.encode(hasher.hash(data))
      if (hash !== untrustedHash) {
        return new Response("request body does not match provided hash", { status: 400 })
      }
      dataCache.getRaw(key, async () => data)
      return new Response(null, { status: 204 })
    } else {
      return new Response(null, { status: 405 })
    }
  }

  async function handleCodegen(request: Request, hash: string, path: string) {
    return f.code(
      generatedCache,
      request,
      () =>
        generatedCache.getString(hash + path, codeTtl, async () => {
          const codegenSpec = await dataCache.get(`codegen/${hash}`, $codegenSpec, () => {
            throw new Response(`${hash} not found`, { status: 404 })
          })

          let match: [string[], CodegenEntry] | undefined = undefined
          for (const [key, value] of codegenSpec.codegen) {
            if (
              path.startsWith(`/${key.map((x) => x + "/").join("")}`)
              && key.length >= (match?.[0].length ?? 0)
            ) {
              match = [key, value]
            }
          }

          if (!match) throw f.notFound()

          const [key, entry] = match

          const files = await filesMemo.run(`${hash}/${key.join("/")}`, async () => {
            const metadataHash = hex.encode(entry.metadata)
            const metadata = decodeMetadata(
              await dataCache.getRaw(`metadata/${metadataHash}`, async () => {
                throw new Response(`${hash} not found`, { status: 404 })
              }),
            )

            const codegen = new FrameCodegen(metadata, entry.chainName)
            const files = new Map<string, string>()
            codegen.write(files)
            files.set("capi.js", `export * from "${"../".repeat(key.length + 1)}capi/mod.ts"`)
            files.set("capi.d.ts", `export * from "${"../".repeat(key.length + 1)}capi/mod.ts"`)
            files.set(
              "connection.js",
              `
import * as C from "./capi.js"

export const connectionCtor = C.WsConnection

${
                entry.connection.type === "ws"
                  ? `export const discoveryValue = ${JSON.stringify(entry.connection.discovery)}`
                  : `
const controller = new AbortController()
const signal = controller.signal
const api = await C.connectScald(C.$api, new C.WsLink(new WebSocket("ws://localhost:4646/api"), signal), signal)
const devChain = ${
                    entry.connection.type === "capnChain"
                      ? `await api.getChain(${JSON.stringify(entry.connection.name)})`
                      : `(await api.getNetwork(${JSON.stringify(entry.connection.network)})).get(${
                        JSON.stringify(entry.connection.name)
                      })`
                  }

export const discoveryValue = devChain.url
export const createUsers = C.testUserFactory(devChain.nextUsers)

// TODO: fix
setTimeout(() => controller.abort(), 5000)
`
              }

`,
            )
            files.set(
              "connection.d.ts",
              `
import * as C from "./capi.js"

export const connectionCtor: typeof C.WsConnection
export const discoveryValue: string

${
                entry.connection.type === "ws" ? "" : `
export const createUsers: ReturnType<typeof C.testUserFactory>
`
              }
`,
            )
            return files
          })

          const subpath = path.slice(`/${key.map((x) => x + "/").join("")}`.length)

          if (!files.has(subpath)) throw f.notFound()
          return tsFormatter.formatText(path, files.get(subpath)!)
        }),
    )
  }
}

export function handleErrors(handler: Handler): Handler {
  return async (request, connInfo) => {
    try {
      return await handler(request, connInfo)
    } catch (e) {
      if (e instanceof Response) return e.clone()
      console.error(e)
      return f.serverError(Deno.inspect(e))
    }
  }
}

export function handleCors(handler: Handler): Handler {
  return async (request, connInfo) => {
    const newHeaders = new Headers()
    newHeaders.set("Access-Control-Allow-Origin", "*")
    newHeaders.set("Access-Control-Allow-Headers", "*")
    newHeaders.set("Access-Control-Allow-Methods", "*")
    newHeaders.set("Access-Control-Allow-Credentials", "true")

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: newHeaders,
        status: Status.NoContent,
      })
    }

    const res = await handler(request, connInfo)

    // Deno.upgradeWebSocket response objects cannot be modified
    if (res.headers.get("upgrade") !== "websocket") {
      for (const [k, v] of res.headers) {
        newHeaders.append(k, v)
      }

      return new Response(res.body, {
        headers: newHeaders,
        status: res.status,
        statusText: res.statusText,
      })
    }

    return res
  }
}
