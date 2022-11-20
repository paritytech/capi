// deno-lint-ignore-file require-await

import { tsFormatter } from "../deps/dprint.ts"
import * as $ from "../deps/scale.ts"
import * as C from "../mod.ts"
import * as T from "../test_util/mod.ts"
import * as U from "../util/mod.ts"
import { TimedMemo } from "../util/mod.ts"
import { Cache, FsCache } from "./cache.ts"
import { Files } from "./Files.ts"
import { codegen } from "./mod.ts"

const suggestedChainUrls = [
  "dev:polkadot",
  "dev:westend",
  "dev:rococo",
  "dev:kusama",
  "wss:rpc.polkadot.io",
  "wss:kusama-rpc.polkadot.io",
  // "wss://acala-polkadot.api.onfinality.io/public-ws/",
  "wss:rococo-contracts-rpc.polkadot.io",
  "wss:wss.api.moonbeam.network",
  "wss:statemint-rpc.polkadot.io",
  "wss:para.subsocial.network",
  "wss:westend-rpc.polkadot.io",
]

export class CodegenServer {
  constructor(readonly cache: Cache, readonly modIndex: string[]) {}
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
    try {
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
    } catch (e) {
      console.error(e)
    }
  }

  static rWithCapiVersion = /^\/@([^\/]+)(\/.*)?$/
  static rWithChainUrl = /^\/proxy\/(dev:\w+|wss?:[^\/]+)\/(?:@([^\/]+)\/)?(.*)$/
  static rImportIntellisense =
    /^\/\.well-known\/deno-import-intellisense\.json$|^\/import-intellisense\/.*$/
  async handleRequest(request: Request): Promise<Response> {
    let path = new URL(request.url).pathname
    console.log(path)
    if (path === "/.well-known/deno-import-intellisense.json") {
      return this.handleImportIntellisenseRequest(path)
    }
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
    if ((match = CodegenServer.rWithChainUrl.exec(path))) {
      const [, chainUrl, chainVersion, filePath] = match
      return this.handleChainRequest(request, chainUrl!, chainVersion, filePath!)
    }
    if ((match = CodegenServer.rImportIntellisense.exec(path))) {
      return this.handleImportIntellisenseRequest(path)
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
    chainUrl: string,
    chainVersion: string | undefined,
    filePath: string,
  ) {
    if (!chainVersion) {
      const latestChainVersion = await this.getLatestChainVersion(chainUrl)
      return this.redirect(
        `/@${this.version}/proxy/${chainUrl}/@${latestChainVersion}/${filePath}`,
      )
    }
    if (chainVersion !== this.normalizeVersion(chainVersion)) {
      return this.redirect(
        `/@${this.version}/proxy/${chainUrl}/@${this.normalizeVersion(chainVersion)}/${filePath}`,
      )
    }
    return this.ts(
      request,
      await this.cache.getRaw(
        `generated/@${this.version}/${chainUrl}/@${chainVersion}/${filePath}`,
        async () => {
          const files = await this.getFiles(chainUrl, chainVersion)
          const file = files.get(filePath)
          if (!file) throw this.e404()
          return new TextEncoder().encode(tsFormatter.formatText(filePath, file()))
        },
      ),
    )
  }

  async getFiles(chainUrl: string, chainVersion: string) {
    const metadata = await this.getMetadata(chainUrl, chainVersion)
    return U.getOrInit(this.filesMemo, metadata, () => {
      return codegen({
        metadata,
        clientDecl: chainUrl.startsWith("dev:")
          ? `
import { LocalClientEffect } from ${JSON.stringify(`/@${this.version}/test_util/local.ts`)}
export const client = new LocalClientEffect(${JSON.stringify(chainUrl.slice(4))})
          `
          : `
export const client = C.rpc.rpcClient(C.rpc.proxyProvider, ${JSON.stringify(chainUrl)})
          `,
        importSpecifier: `/@${this.version}/mod.ts`,
      })
    })
  }

  static $fileIndex = $.array($.str)
  async getFilesIndex(chainUrl: string, chainVersion: string) {
    return await this.cache.get(
      `generated/@${this.version}/${chainUrl}/@${chainVersion}/_index.json`,
      CodegenServer.$fileIndex,
      async () => {
        const files = await this.getFiles(chainUrl, chainVersion)
        return [...files.keys()]
      },
    )
  }

  async handleImportIntellisenseRequest(path: string) {
    if (path === "/.well-known/deno-import-intellisense.json") {
      return this.json({
        version: 2,
        registries: [true, false].flatMap((hasVersion) => {
          const versionSchema = hasVersion ? "/:version(@[^/]+)" : ""
          const versionVariables = hasVersion
            ? [{ key: "version", url: "/import-intellisense/version" }]
            : []
          const versionUrl = hasVersion ? "/${version}" : ""
          return [
            {
              schema: (versionSchema ? versionSchema + "?" : "") + "/:filePath*",
              variables: [
                ...versionVariables,
                {
                  key: "filePath",
                  url: versionUrl + "/import-intellisense/modFilePath/${filePath}",
                },
              ],
            },
            ...[true, false].map((hasChainVersion) => {
              const chainVersionSchema = hasChainVersion ? "/:chainVersion(@[^/]+)" : ""
              const chainVersionPlaceholder = hasChainVersion ? "${chainVersion}" : "_"
              const chainVersionVariables = hasChainVersion
                ? [{
                  key: "chainVersion",
                  url: versionUrl
                    + "/import-intellisense/chainVersion/${chainUrl}/${chainVersion}",
                }]
                : []
              return {
                schema: versionSchema
                  + `/:_proxy(proxy)/:chainUrl(dev:\\w*|wss?:[^/]*)${chainVersionSchema}/:filePath*`,
                variables: [
                  ...versionVariables,
                  { key: "_proxy", url: "/import-intellisense/null" },
                  {
                    key: "chainUrl",
                    url: versionUrl + "/import-intellisense/chainUrl/${chainUrl}",
                  },
                  ...chainVersionVariables,
                  {
                    key: "filePath",
                    url: versionUrl
                      + `/import-intellisense/genFilePath/\${chainUrl}/${chainVersionPlaceholder}/\${filePath}`,
                  },
                ],
              }
            }),
          ]
        }),
      })
    }
    const parts = path.slice(1).split("/")
    console.log(parts)
    if (parts[0] !== "import-intellisense") return this.e404()
    if (parts[1] === "null") {
      return this.json({ items: [] })
    }
    if (parts[1] === "version") {
      return this.json({
        items: ["@" + this.version],
        preselect: "@" + this.version,
      })
    }
    if (parts[1] === "chainUrl") {
      return this.json({
        items: suggestedChainUrls,
      })
    }
    if (parts[1] === "chainVersion") {
      const chainUrl = parts[2]!
      const version = await this.getLatestChainVersion(chainUrl)
      console.log(version)
      return this.json({ items: ["@" + version], preselect: "@" + version })
    }
    if (parts[1] === "modFilePath") {
      if (parts[2] === "proxy" || parts[2]?.startsWith("@")) return this.json({ items: [] })
      const result = this.filePathIntellisense(this.modIndex, parts.slice(2))
      if (!parts[3]) {
        result.items.unshift("proxy/")
        result.preselect = "proxy/"
      }
      return this.json(result)
    }
    if (parts[1] === "genFilePath") {
      const chainUrl = parts[2]!
      const chainVersion = parts[3]?.slice(1) || await this.getLatestChainVersion(chainUrl)
      const filesIndex = await this.getFilesIndex(chainUrl, chainVersion)
      return this.json(this.filePathIntellisense(filesIndex, parts.slice(4)))
    }
    return this.e404()
  }

  filePathIntellisense(index: string[], partial: string[]) {
    let dir = partial.join("/") + "/"
    let result
    while (true) {
      if (dir === "/") dir = ""
      result = [
        ...new Set(
          index.filter((x) => x.startsWith(dir)).map((x) =>
            dir + x.slice(dir.length).replace(/\/.*$/, "/")
          ),
        ),
      ].sort((a, b) =>
        (+(b === dir + "mod.ts") - +(a === dir + "mod.ts"))
        || (+b.endsWith("/") - +a.endsWith("/"))
        || (a < b ? -1 : 1)
      )
      if (!result.length && dir) {
        dir = dir.replace(/[^\/]+\/$/, "")
        continue
      }
      break
    }
    return { items: result, isIncomplete: true, preselect: dir + "mod.ts" }
  }

  json(body: unknown) {
    return new Response(JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
      },
    })
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

  getLatestChainVersionMemo = new TimedMemo<string, string>(60000)
  async getLatestChainVersion(chainUrl: string) {
    return this.getLatestChainVersionMemo.run(chainUrl, async () => {
      const client = this.getClient(chainUrl)
      const chainVersion = U.throwIfError(
        await C.rpcCall("system_version")(client)().as<string>().next(this.normalizeVersion).run(),
      )
      return chainVersion
    })
  }

  getMetadata(chainUrl: string, version: string) {
    return this.cache.get(`metadata/${chainUrl}/${version}`, C.M.$metadata, async () => {
      const client = this.getClient(chainUrl)
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

  getClient(chainUrl: string) {
    if (chainUrl.startsWith("dev:")) {
      const runtime = chainUrl.slice("dev:".length)
      if (!T.isRuntimeName(runtime)) {
        throw new T.InvalidRuntimeSpecifiedError(runtime)
      }
      return T[runtime]
    } else {
      return C.rpcClient(C.rpc.proxyProvider, chainUrl.replace(/:/, "://"))
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

if (import.meta.main) {
  const modIndex = await getModIndex()
  console.log("listening")
  new CodegenServer(new FsCache("target/codegen"), modIndex).listen(5646)
}

export async function getModIndex() {
  const cmd = Deno.run({
    cmd: ["git", "ls-files"],
    stdout: "piped",
  })
  if (!(await cmd.status()).success) throw new Error("git ls-files failed")
  const output = new TextDecoder().decode(await cmd.output())
  return output.split("\n").filter((x) => x.endsWith(".ts"))
}
