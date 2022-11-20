import { serve } from "https://deno.land/std@0.165.0/http/server.ts"
import { tsFormatter } from "../../deps/dprint.ts"
import * as $ from "../../deps/scale.ts"
import * as C from "../../mod.ts"
import * as T from "../../test_util/mod.ts"
import * as U from "../../util/mod.ts"
import { TimedMemo } from "../../util/mod.ts"
import { Files } from "../Files.ts"
import { codegen } from "../mod.ts"
import { Cache } from "./cache.ts"
import { highlighter } from "./highlighter.ts"

const suggestedDevChains = [
  "dev:polkadot",
  "dev:westend",
  "dev:rococo",
  "dev:kusama",
]

const suggestedChainUrls = [
  "wss:rpc.polkadot.io",
  "wss:kusama-rpc.polkadot.io",
  // "wss://acala-polkadot.api.onfinality.io/public-ws/",
  "wss:rococo-contracts-rpc.polkadot.io",
  "wss:wss.api.moonbeam.network",
  "wss:statemint-rpc.polkadot.io",
  "wss:para.subsocial.network",
  "wss:westend-rpc.polkadot.io",
]

export abstract class CodegenServer {
  abstract getDefaultVersion(request: Request): Promise<string>
  abstract version: string
  abstract cache: Cache
  abstract modIndex: Promise<string[]>
  abstract handleModRequest(request: Request, path: string): Promise<Response>
  abstract delegateRequest(request: Request, version: string, path: string): Promise<Response>
  abstract getVersionSuggestions(partial: string): Promise<string[]>
  abstract devChains: boolean

  metadataMemo = new Map<string, Promise<[string, C.M.Metadata]>>()
  filesMemo = new Map<C.M.Metadata, Files>()

  listen(port: number, signal?: AbortSignal) {
    return serve((req) =>
      this.handleRequest(req).catch((e) => {
        if (e instanceof Response) return e
        return new Response(Deno.inspect(e), { status: 500 })
      }), { port, signal })
  }

  static rWithCapiVersion = /^\/@([^\/]+)(\/.*)?$/
  static rWithChainUrl = /^\/proxy\/(dev:\w+|wss?:[^\/]+)\/(?:@([^\/]+)\/)?(.*)$/
  async handleRequest(request: Request): Promise<Response> {
    let path = new URL(request.url).pathname
    if (path === "/.well-known/deno-import-intellisense.json") {
      return this.handleImportIntellisenseRequest(path)
    }
    let match = CodegenServer.rWithCapiVersion.exec(path)
    if (!match) {
      return this.redirect(`/@${await this.getDefaultVersion(request)}${path}`)
    }
    const version = match[1]!
    path = match[2] ?? "/"
    if (version !== this.version) {
      return this.delegateRequest(request, version, path)
    }
    if (!path) return this.redirect(`/@${version}/`)
    if (path === "/") {
      return this.html(`<pre>capi@${this.version}</pre>`)
    }
    if (path.startsWith("/proxy/")) {
      if (!(match = CodegenServer.rWithChainUrl.exec(path))) return this.e404()
      const [, chainUrl, chainVersion, filePath] = match
      return this.handleChainRequest(request, chainUrl!, chainVersion, filePath!)
    }
    if (path.startsWith("/import-intellisense/")) {
      return this.handleImportIntellisenseRequest(path)
    }
    return this.handleModRequest(request, path)
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
    if (chainVersion !== this.normalizeChainVersion(chainVersion)) {
      return this.redirect(
        `/@${this.version}/proxy/${chainUrl}/@${
          this.normalizeChainVersion(chainVersion)
        }/${filePath}`,
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
        registries: [
          {
            schema: "/:version(@[^/]*)?/:filePath*",
            variables: [
              { key: "version", url: "/import-intellisense/version" },
              {
                key: "filePath",
                url: "/${version}/import-intellisense/modFilePath/${filePath}",
              },
            ],
          },
          {
            schema:
              "/:version(@[^/]*)/:_proxy(proxy)/:chainUrl(dev:\\w*|wss?:[^/]*)/:chainVersion(@[^/]+)/:filePath*",
            variables: [
              { key: "version", url: "/import-intellisense/version" },
              { key: "_proxy", url: "/import-intellisense/null" },
              {
                key: "chainUrl",
                url: "/${version}/import-intellisense/chainUrl/${chainUrl}",
              },
              {
                key: "chainVersion",
                url: "/${version}/import-intellisense/chainVersion/${chainUrl}/${chainVersion}",
              },
              {
                key: "filePath",
                url:
                  "/${version}/import-intellisense/genFilePath/${chainUrl}/${chainVersion}/${filePath}",
              },
            ],
          },
        ],
      })
    }
    const parts = path.slice(1).split("/")
    if (parts[0] !== "import-intellisense") return this.e404()
    if (parts[1] === "null") {
      return this.json({ items: [] })
    }
    if (parts[1] === "version") {
      const suggestions = await this.getVersionSuggestions(parts[2] ?? "")
      return this.json({
        items: suggestions.map((x) => "@" + x),
        isIncomplete: true,
        preselect: "@" + suggestions[0],
      })
    }
    if (parts[1] === "chainUrl") {
      return this.json({
        items: [
          ...(this.devChains ? suggestedDevChains : []),
          ...suggestedChainUrls,
        ],
      })
    }
    if (parts[1] === "chainVersion") {
      const chainUrl = parts[2]!
      const [latest, other] = await Promise.all([
        this.getLatestChainVersion(chainUrl),
        this.cache.list(`metadata/${chainUrl}/`).then((x) => x.map((x) => x.split("/").at(-1)!)),
      ])
      const versions = [...new Set([latest, ...other])]
      return this.json({ items: versions.map((x) => "@" + x), preselect: "@" + versions[0] })
    }
    if (parts[1] === "modFilePath") {
      if (parts[2] === "proxy" || parts[2]?.startsWith("@")) return this.json({ items: [] })
      const result = this.filePathIntellisense(await this.modIndex, parts.slice(2))
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
        `\
<style>
  body {
    color: ${highlighter.getForegroundColor()};
    background-color: ${highlighter.getBackgroundColor()};
  }
  .shiki {
    counter-reset: line;
    counter-increment: line 0;
  }
  .shiki .line::before {
    content: counter(line);
    counter-increment: line;
    width: 5ch;
    margin-right: 2ch;
    display: inline-block;
    text-align: right;
    color: rgba(115,138,148,.4)
  }
</style>
<body>
  <h3><code>${new URL(request.url).pathname}</code></h3>
  ${highlighter.codeToHtml(body, { lang: "ts" })}
</body>
`,
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

  redirect(path: string) {
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
        await C.rpcCall("system_version")(client)().as<string>().next(this.normalizeChainVersion)
          .run(),
      )
      return chainVersion
    })
  }

  getMetadata(chainUrl: string, version: string) {
    return this.cache.get(`metadata/${chainUrl}/${version}`, C.M.$metadata, async () => {
      const client = this.getClient(chainUrl)
      const [chainVersion, metadata] = U.throwIfError(
        await C.Z.ls(
          C.rpcCall("system_version")(client)().as<string>().next(this.normalizeChainVersion),
          C.metadata(client)(),
        ).run(),
      )
      if (this.normalizeChainVersion(version) !== chainVersion) {
        console.log(version, chainVersion)
        throw new Error("Outdated version")
      }
      return metadata
    })
  }

  getClient(chainUrl: string) {
    if (chainUrl.startsWith("dev:")) {
      if (!this.devChains) throw new Error("Dev chains are not supported")
      const runtime = chainUrl.slice("dev:".length)
      if (!T.isRuntimeName(runtime)) {
        throw new T.InvalidRuntimeSpecifiedError(runtime)
      }
      return T[runtime]
    } else {
      return C.rpcClient(C.rpc.proxyProvider, chainUrl.replace(/:/, "://"))
    }
  }

  normalizeChainVersion(version: string) {
    if (!version.startsWith("v")) version = "v" + version
    if (version.includes("-")) version = version.split("-")[0]!
    return version
  }
}
