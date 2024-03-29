import { mime } from "https://deno.land/x/mimetypes@v1.0.0/mod.ts"
import { frameCodegen } from "../codegen/frameCodegen.ts"
import { blake2_512, blake2_64 } from "../crypto/hashers.ts"
import { hex } from "../crypto/mod.ts"
import { Tar } from "../deps/std/archive.ts"
import { Status } from "../deps/std/http.ts"
import { Buffer } from "../deps/std/io.ts"
import { posix as path } from "../deps/std/path.ts"
import { readableStreamFromReader, writableStreamFromWriter } from "../deps/std/streams.ts"
import { decodeMetadata } from "../frame_metadata/decodeMetadata.ts"
import { $metadata } from "../frame_metadata/raw/v14.ts"
import { CacheBase } from "../util/cache/base.ts"
import { WeakMemo } from "../util/memo.ts"
import { normalizePackageName, normalizeVariableName } from "../util/mod.ts"
import { tsFormatterPromise } from "../util/tsFormatter.ts"
import { $codegenSpec, CodegenEntry } from "./CodegenSpec.ts"
import * as f from "./factories.ts"
import { getStatic } from "./getStatic.ts"

const { relative } = path

const rCodegenUrl = /^\/([\da-f]{16})(\/.+)?$/
const rUploadUrl = /^\/upload\/(codegen\/[\da-f]{16}|metadata\/[\da-f]{128})$/
const rTarball = /^\/([^\/]+)\.tar$/

const codeTtl = 60_000

export function createCodegenHandler(dataCache: CacheBase, tempCache: CacheBase) {
  const filesMemo = new WeakMemo<string, Map<string, string>>()
  return handle

  async function handle(request: Request) {
    const url = new URL(request.url)
    const { pathname } = url
    if (pathname === "/") return f.html(await getStatic("./static/index.html"))
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
        return await getStatic(`../${pathname.slice("/capi/".length)}`)
      })
    }
    return new Response(await getStatic(`./static${pathname}`), {
      headers: {
        "Content-Type": mime.getType(pathname) ?? "text/plain",
      },
    })
  }

  async function handleUpload(request: Request, key: string) {
    const [kind, untrustedHash] = key.split("/") as ["codegen" | "metadata", string]
    if (request.method === "HEAD") {
      const exists = await dataCache.has(key)
      return new Response(null, { status: exists ? Status.NoContent : Status.NotFound })
    } else if (request.method === "PUT") {
      if (await dataCache.has(key)) {
        return new Response(null, { status: Status.NoContent })
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
        return new Response("invalid request body data", { status: Status.BadRequest })
      }
      const hash = hex.encode(hasher.hash(data))
      if (hash !== untrustedHash) {
        return new Response("request body does not match provided hash", {
          status: Status.BadRequest,
        })
      }
      dataCache.getRaw(key, async () => data)
      return new Response(null, { status: Status.NoContent })
    } else {
      return new Response(null, { status: Status.MethodNotAllowed })
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
            throw new Response(`${hash} not found`, { status: Status.NotFound })
          })

          let match: [string, CodegenEntry] | undefined = undefined
          for (const [key, value] of codegenSpec.codegen) {
            if (path === `/${key}`) {
              return `export * from "./${key.split("/").at(-1)!}/mod.js"`
            }
            if (
              (path === `/${key}` || path.startsWith(`/${key}/`))
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
          return (await tsFormatterPromise).formatText(path, files.get(subpath)!)
        }),
    )
  }

  async function getFiles(hash: string, key: string, entry: CodegenEntry) {
    return await filesMemo.run(`${hash}/${key}`, async () => {
      const metadataHash = hex.encode(entry.metadataHash)
      const metadata = decodeMetadata(
        await dataCache.getRaw(`metadata/${metadataHash}`, async () => {
          throw new Response(`${hash} not found`, { status: Status.NotFound })
        }),
      )

      const files = new Map<string, string>()
      frameCodegen(metadata, entry.chainName, files)
      const capiCode = `export * from "${relative(`${hash}/${key}/`, "capi/mod.ts")}"`
      files.set("capi.js", capiCode)
      files.set("capi.d.ts", capiCode)
      writeConnectionCode(files, entry)
      return files
    })
  }

  async function handleTarball(hash: string, name: string) {
    const tarball = await tempCache.getRaw(`${hash}/${name}.tar`, async () => {
      const codegenSpec = await dataCache.get(`codegen/${hash}`, $codegenSpec, () => {
        throw new Response(`${hash} not found`, { status: Status.NotFound })
      })

      const rootFiles = new Map<string, string>()

      await Promise.all(
        [...codegenSpec.codegen]
          .filter(([key]) => key === name || key.startsWith(`${name}/`))
          .map(async ([key, entry]) => {
            const prefix = key.slice(name.length + 1)
            const files = await getFiles(hash, key, entry)
            for (let [path, content] of files) {
              if (path === "capi.js" || path === "capi.d.ts") {
                content = `export * from "capi"`
              }
              if (prefix) {
                path = `${prefix}/${path}`
              }
              if (/\.(js|ts)$/.test(path)) {
                content = (await tsFormatterPromise).formatText(path, content)
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

function writeConnectionCode(files: Map<string, string>, codegenEntry: CodegenEntry) {
  const chainRuneTypeName = `${codegenEntry.chainName}Rune`
  const chainRuneInstanceName = normalizeVariableName(codegenEntry.chainName)
  files.set(
    "connection.d.ts",
    `
      import * as C from "./capi.js"
      import { ${chainRuneTypeName} } from "./chain.js"

      export const connect: (signal: AbortSignal) => C.Connection

      export const ${chainRuneInstanceName}: ${chainRuneTypeName}<never>
    `,
  )
  files.set(
    "connection.js",
    `
      import * as C from "./capi.js"
      import { ${chainRuneTypeName} } from "./chain.js"

      export const connect = C.detectConnect(
        ${JSON.stringify(codegenEntry.connection)},
        ${JSON.stringify(codegenEntry.targets)},
      )

      export const ${chainRuneInstanceName} = ${chainRuneTypeName}.from(connect)
    `,
  )
}
