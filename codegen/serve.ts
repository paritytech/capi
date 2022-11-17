// deno-lint-ignore-file require-await

import { tsFormatter } from "../deps/dprint.ts"
import * as C from "../mod.ts"
import * as T from "../test_util/mod.ts"
import * as U from "../util/mod.ts"
import { TimedMemo } from "../util/mod.ts"
import { Cache } from "./cache.ts"
import { Files } from "./Files.ts"
import { codegen } from "./mod.ts"

export class CodegenServer {
  constructor(readonly cache: Cache) {}
  version = "local"

  metadataMemo = new Map<string, Promise<[string, C.M.Metadata]>>()
  filesMemo = new Map<C.M.Metadata, Files>()

  landingHtml = `<pre>
capi@${this.version}
</pre>`

  async listen(port: number) {
    const server = Deno.listen({ port })
    for await (const conn of server) {
      this.serveHttp(conn)
    }
  }

  async serveHttp(conn: Deno.Conn) {
    const httpConn = Deno.serveHttp(conn)
    for await (const event of httpConn) {
      event.respondWith(
        this.handleRequest(event.request).then(async (r) => {
          return r
        }).catch((e) => {
          if (e instanceof Response) return e
          return new Response(Deno.inspect(e), { status: 500 })
        }),
      )
    }
  }

  static rWithCapiVersion = /^\/@([^\/]+)(\/.*)?$/
  static rWithChainSpec = /^\/(dev:\w+|wss?:\/\/(?:[^\/]+\/)+)\/(?:@([^\/]+)\/)?(.*)$/
  async handleRequest(request: Request): Promise<Response> {
    let path = new URL(request.url).pathname
    console.log(path)
    let match = CodegenServer.rWithCapiVersion.exec(path)
    if (!match) {
      return this.redirect(`/@${this.version}${path}`)
    }
    const version = match[1]!
    if (version !== this.version) {
      return this.eUnimplemented()
    }
    path = match[2]!
    if (!path) return this.redirect(`/@${version}/`)
    if (path === "/") {
      return this.html(this.landingHtml)
    }
    if ((match = CodegenServer.rWithChainSpec.exec(path))) {
      const [, chainSpec, chainVersion, filePath] = match
      return this.handleChainRequest(request, chainSpec!, chainVersion, filePath!)
    }
    if (path.endsWith(".ts")) {
      const res = await fetch(this.capiFile("." + path))
      if (!res.ok) return this.e404()
      return this.ts(request, await res.text())
    }
    return this.e404()
  }

  async handleChainRequest(
    request: Request,
    chainSpec: string,
    chainVersion: string | undefined,
    filePath: string,
  ) {
    if (!chainVersion) {
      const latestChainVersion = await this.getLatestChainVersion(chainSpec)
      return this.redirect(`/@${this.version}/${chainSpec}/@${latestChainVersion}/${filePath}`)
    }
    if (chainVersion !== this.normalizeVersion(chainVersion)) {
      return this.redirect(
        `/@${this.version}/${chainSpec}/@${this.normalizeVersion(chainVersion)}/${filePath}`,
      )
    }
    return this.ts(
      request,
      await this.cache.getRaw(
        `generated/@${this.version}/${chainSpec}/@${chainVersion}/${filePath}`,
        async () => {
          const metadata = await this.getMetadata(chainSpec, chainVersion)
          const files = U.getOrInit(this.filesMemo, metadata, () => {
            return codegen({
              metadata,
              clientDecl: chainSpec.startsWith("dev:")
                ? `
import { LocalClientEffect } from ${JSON.stringify(`/@${this.version}/test_util/local.ts`)}
export const client = new LocalClientEffect(${JSON.stringify(chainSpec.slice(4))})
                `
                : `
export const client = C.rpc.rpcClient(C.rpc.proxyProvider, ${JSON.stringify(chainSpec)})
                `,
              importSpecifier: `/@${this.version}/mod.ts`,
            })
          })
          const file = files.get(filePath)
          if (!file) throw this.e404()
          return new TextEncoder().encode(tsFormatter.formatText(filePath, file()))
        },
      ),
    )
  }

  ts(request: Request, body: string | Uint8Array) {
    if (request.headers.get("Accept")?.split(",").includes("text/html")) {
      if (typeof body !== "string") body = new TextDecoder().decode(body)
      return this.html(
        `<h3><code>${new URL(request.url).pathname}</code></h3><pre>${body}</pre>`,
      )
    }
    return new Response(body, {
      headers: {
        "Content-Type": "application/typescript",
      },
    })
  }

  html(html: string) {
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  }

  e404() {
    return new Response("404", { status: 404 })
  }

  eUnimplemented() {
    return new Response("unimplemented", { status: 500 })
  }

  redirect(path: string) {
    console.log("redirect", path)
    return new Response(null, {
      status: 302,
      headers: {
        Location: path,
      },
    })
  }

  getLatestChainVersionMemo = new TimedMemo<string, string>(5000)
  async getLatestChainVersion(chainSpec: string) {
    return this.getLatestChainVersionMemo.run(chainSpec, async () => {
      const client = this.getClient(chainSpec)
      const chainVersion = U.throwIfError(
        await C.rpcCall("system_version")(client)().as<string>().next(this.normalizeVersion).run(),
      )
      return chainVersion
    })
  }

  getMetadata(chainSpec: string, version: string) {
    return this.cache.get(`metadata/${chainSpec}/${version}`, C.M.$metadata, async () => {
      const client = this.getClient(chainSpec)
      const [chainVersion, metadata] = U.throwIfError(
        await C.Z.ls(
          C.rpcCall("system_version")(client)().as<string>().next(this.normalizeVersion),
          C.metadata(client)(),
        ).run(),
      )
      if (this.normalizeVersion(version) !== chainVersion) {
        console.log(version, chainVersion)
        throw new Error("Outdated version")
      }
      return metadata
    })
  }

  getClient(chainSpec: string) {
    if (chainSpec.startsWith("dev:")) {
      const runtime = chainSpec.slice("dev:".length)
      if (!T.isRuntimeName(runtime)) {
        throw new T.InvalidRuntimeSpecifiedError(runtime)
      }
      return T[runtime]
    } else {
      return C.rpcClient(C.rpc.proxyProvider, chainSpec)
    }
  }

  normalizeVersion(version: string) {
    if (!version.startsWith("v")) version = "v" + version
    if (version.includes("-")) version = version.split("-")[0]!
    return version
  }

  capiFile(path: string) {
    return new URL(path, new URL("..", import.meta.url)).toString()
  }
}
