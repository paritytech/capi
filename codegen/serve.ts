// deno-lint-ignore-file require-await

import { tsFormatter } from "../deps/dprint.ts"
import * as C from "../mod.ts"
import * as T from "../test_util/mod.ts"
import * as U from "../util/mod.ts"
import { Files } from "./Files.ts"
import { codegen } from "./mod.ts"

const port = +(Deno.env.get("PORT") ?? 8080)

// Start listening on port 8080 of localhost.
const server = Deno.listen({ port: port })
console.log(`http://localhost:${port}/`)

const currentVersion = "local"

const rWithCapiVersion = /^\/@([^\/]+)(\/.*)?$/
const rWithChainSpec = /^\/(dev:\w+|wss?:\/\/(?:[^\/]+\/)+)\/(?:@([^\/]+)\/)?(.*)$/

const metadataMemo = new Map<string, Promise<[string, C.M.Metadata]>>()
const filesMemo = new Map<C.M.Metadata, Files>()

const landingHtml = `<pre>
capi@${currentVersion}
</pre>`

for await (const conn of server) {
  serveHttp(conn)
}

async function serveHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn)
  for await (const event of httpConn) {
    event.respondWith(handleRequest(new URL(event.request.url).pathname))
  }
}

async function handleRequest(path: string): Promise<Response> {
  console.log(path)
  let match = rWithCapiVersion.exec(path)
  if (!match) {
    return redirect(`/@${currentVersion}${path}`)
  }
  const version = match[1]!
  if (version !== currentVersion) {
    return eUnimplemented()
  }
  path = match[2]!
  if (!path) return redirect(`/@${version}/`)
  if (path === "/") {
    return rHtml(landingHtml)
  }
  match = rWithChainSpec.exec(path)
  if (!match) {
    return e404()
  }
  const [, chainSpec, chainVersion, filePath] = match
  const [resolvedChainVersion, metadata] = await getMetadata(chainSpec!, chainVersion)
  if (chainVersion !== resolvedChainVersion) {
    return redirect(`/@${version}/${chainSpec}/@${resolvedChainVersion}/${filePath}`)
  }
  const files = U.getOrInit(filesMemo, metadata, () => {
    return codegen({
      metadata,
      clientFile: chainSpec!.startsWith("dev:")
        ? capiFile(`test_util/clients/${chainSpec!.slice(4)}.ts`)
        : "TODO",
      importSpecifier: capiFile("mod.ts"),
    })
  })
  const file = files.get(filePath!)
  if (!file) return e404()
  return rTs(tsFormatter.formatText(filePath!, file()))
}

function rTs(html: string) {
  return new Response(html, {
    headers: {
      "Content-Type": "application/typescript",
    },
  })
}

function rText(html: string) {
  return new Response(html, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}

function rHtml(html: string) {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}

function e404() {
  return new Response("404", { status: 404 })
}

function eUnimplemented() {
  return new Response("unimplemented", { status: 500 })
}

function redirect(path: string) {
  console.log("redirect", path)
  return new Response(null, {
    status: 302,
    headers: {
      Location: path,
    },
  })
}

async function getMetadata(
  chainSpec: string,
  version: string | undefined,
): Promise<[version: string, metadata: C.M.Metadata]> {
  return U.getOrInit(metadataMemo, `${chainSpec}/@${version}`, async () => {
    let client
    if (chainSpec.startsWith("dev:")) {
      const runtime = chainSpec.slice("dev:".length)
      if (!T.isRuntimeName(runtime)) {
        throw new T.InvalidRuntimeSpecifiedError(runtime)
      }
      client = T[runtime]
    } else {
      client = C.rpcClient(C.rpc.proxyProvider, chainSpec)
    }
    const [chainVersion, metadata] = U.throwIfError(
      await C.Z.ls(
        C.rpcCall("system_version")(client)().as<string>().next(normalizeVersion),
        C.metadata(client)(),
      ).run(),
    )
    if (version && normalizeVersion(version) !== chainVersion) {
      console.log(version, chainVersion)
      throw new Error("Outdated version")
    }
    const result: [string, C.M.Metadata] = [chainVersion, metadata]
    U.getOrInit(metadataMemo, `${chainSpec}/@${version}`, async () => result)
    U.getOrInit(metadataMemo, `${chainSpec}/@undefined`, async () => result)
    return result
  })
}

function normalizeVersion(version: string) {
  if (!version.startsWith("v")) version = "v" + version
  if (version.includes("-")) version = version.split("-")[0]!
  return version
}

function capiFile(path: string) {
  return new URL(path, new URL("..", import.meta.url)).toString()
}
