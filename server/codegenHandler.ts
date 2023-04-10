import { mime } from "https://deno.land/x/mimetypes@v1.0.0/mod.ts"
import { FrameCodegen } from "../codegen/FrameCodegen.ts"
import { blake2_512, blake2_64 } from "../crypto/hashers.ts"
import { hex } from "../crypto/mod.ts"
import { Tar } from "../deps/std/archive.ts"
import { Handler } from "../deps/std/http.ts"
import { Buffer } from "../deps/std/io.ts"
import { posix as path } from "../deps/std/path.ts"
import { readableStreamFromReader, writableStreamFromWriter } from "../deps/std/streams.ts"
import { decodeMetadata } from "../frame_metadata/decodeMetadata.ts"
import { $metadata } from "../frame_metadata/raw/v14.ts"
import { CacheBase } from "../util/cache/base.ts"
import { WeakMemo } from "../util/memo.ts"
import { normalizePackageName } from "../util/normalize.ts"
import { tsFormatter } from "../util/tsFormatter.ts"
import { $codegenSpec, CodegenEntry } from "./codegenSpec.ts"
import * as f from "./factories.ts"

const { relative } = path

const rCodegenUrl = /^\/([\da-f]{16})(\/.+)?$/
const rUploadUrl = /^\/upload\/(codegen\/[\da-f]{16}|metadata\/[\da-f]{128})$/
const rTarball = /^\/([^\/]+)\.tar$/

const codeTtl = 60_000

export function createCodegenHandler(dataCache: CacheBase, tempCache: CacheBase): Handler {
  const filesMemo = new WeakMemo<string, Map<string, string>>()
  return handle

  async function handle(request: Request) {
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
      return f.code(tempCache, request, async () => {
        const url = new URL(pathname.slice("/capi/".length), import.meta.resolve("../"))
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
  }

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
    const match = rTarball.exec(path)
    if (match) return handleTarball(hash, match[1]!)
    return f.code(
      tempCache,
      request,
      () =>
        tempCache.getString(hash + path, codeTtl, async () => {
          const codegenSpec = await dataCache.get(`codegen/${hash}`, $codegenSpec, () => {
            throw new Response(`${hash} not found`, { status: 404 })
          })

          let match: [string, CodegenEntry] | undefined = undefined
          for (const [key, value] of codegenSpec.codegen) {
            if (
              path.startsWith(`/${key}/`)
              && key.length >= (match?.[0].length ?? 0)
            ) {
              match = [key, value]
            }
          }

          if (!match) throw f.notFound()

          const [key, entry] = match

          const files = await getFiles(hash, key, entry)

          const subpath = path.slice(`/${key}/`.length)

          if (!files.has(subpath)) throw f.notFound()
          return tsFormatter.formatText(path, files.get(subpath)!)
        }),
    )
  }

  async function getFiles(hash: string, key: string, entry: CodegenEntry) {
    return await filesMemo.run(`${hash}/${key}`, async () => {
      const metadataHash = hex.encode(entry.metadata)
      const metadata = decodeMetadata(
        await dataCache.getRaw(`metadata/${metadataHash}`, async () => {
          throw new Response(`${hash} not found`, { status: 404 })
        }),
      )

      const codegen = new FrameCodegen(metadata, entry.chainName)
      const files = new Map<string, string>()
      codegen.write(files)
      const capiCode = `export * from "${relative(`${hash}/${key}/`, "capi/mod.ts")}"`
      files.set("capi.js", capiCode)
      files.set("capi.d.ts", capiCode)
      writeConnectionCode(files, entry.connection)
      return files
    })
  }

  async function handleTarball(hash: string, name: string) {
    const tarball = await tempCache.getRaw(`${hash}/${name}.tar`, async () => {
      const codegenSpec = await dataCache.get(`codegen/${hash}`, $codegenSpec, () => {
        throw new Response(`${hash} not found`, { status: 404 })
      })

      const rootFiles = new Map<string, string>()

      await Promise.all(
        [...codegenSpec.codegen]
          .filter(([key]) => key === name || key.startsWith(`${name}/`))
          .map(async ([key, entry]) => {
            key = key.slice(name.length + 1)
            const files = await getFiles(hash, key, entry)
            for (let [path, content] of files) {
              if (path === "capi.js" || path === "capi.d.ts") {
                content = `export * from "capi"`
              }
              if (key) {
                path = `${key}/${path}`
              }
              if (/\.(js|ts)$/.test(path)) {
                content = tsFormatter.formatText(path, content)
              }
              rootFiles.set(path, content)
            }
          }),
      )

      rootFiles.set(
        "package.json",
        JSON.stringify(
          {
            name: normalizePackageName(name),
            version: `v0.0.0-TODO`,
            type: "module",
            main: "./mod.js",
            peerDependencies: {
              capi: "*",
            },
          },
          null,
          2,
        ),
      )

      const tar = new Tar()
      for (const [name, content] of rootFiles) {
        const data = new TextEncoder().encode(content)
        tar.append(`package/${name}`, {
          contentSize: data.length,
          reader: new Buffer(data),
        })
      }

      const buffer = new Buffer()

      await readableStreamFromReader(tar.getReader())
        .pipeTo(writableStreamFromWriter(buffer))

      return buffer.bytes()
    })
    return new Response(tarball)
  }
}

function writeConnectionCode(files: Map<string, string>, connection: CodegenEntry["connection"]) {
  files.set(
    "connection.js",
    `
import * as C from "./capi.js"

export const connect = C.${connection.type}.bind(${JSON.stringify(connection.discovery)})

${
      connection.type === "DevnetConnection"
        ? `export const createUsers = C.testUserFactory(${JSON.stringify(connection.discovery)})`
        : ""
    }
`,
  )
  files.set(
    "connection.d.ts",
    `
import * as C from "./capi.js"

export const connect: (signal: AbortSignal) => C.Connection

${
      connection.type === "DevnetConnection"
        ? `export const createUsers: ReturnType<typeof C.testUserFactory>`
        : ""
    }
`,
  )
}
