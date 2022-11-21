import { serve } from "https://deno.land/std@0.165.0/http/server.ts"
import { escapeHtml } from "https://deno.land/x/escape@1.4.2/mod.ts"
import * as shiki from "https://esm.sh/shiki@0.11.1?bundle"
import * as $ from "../../deps/scale.ts"
import * as C from "../../mod.ts"
import * as T from "../../test_util/mod.ts"
import * as U from "../../util/mod.ts"
import { TimedMemo } from "../../util/mod.ts"
import { Files } from "../Files.ts"
import { codegen } from "../mod.ts"
import { Cache } from "./cache.ts"

shiki.setCDN("https://unpkg.com/shiki/")
const highlighterPromise = shiki.getHighlighter({ theme: "github-dark", langs: ["ts"] })

const localChains = [
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

const latestChainVersionTtl = 600_000 // 10 minutes
const chainFileTtl = 60_000 // 1 minute
const renderedHtmlTtl = 60_000 // 1 minute

export abstract class CodegenServer {
  abstract version: string
  abstract cache: Cache
  abstract localChainSupport: boolean
  abstract moduleFile(request: Request, path: string, key: string): Promise<Response>
  abstract moduleIndex(): Promise<string[]>
  abstract delegateRequest(request: Request, version: string, path: string): Promise<Response>
  abstract versionSuggestions(): Promise<string[]>
  abstract defaultVersion(request: Request): Promise<string>

  listen(port: number, signal?: AbortSignal) {
    return serve((req) =>
      this.root(req).catch((e) => {
        if (e instanceof Response) return e
        return new Response(Deno.inspect(e), { status: 500 })
      }), { port, signal })
  }

  static rWithCapiVersion = /^\/@([^\/]+)(\/.*)?$/
  static rWithChainUrl = /^\/proxy\/(dev:\w+|wss?:[^\/]+)\/(?:@([^\/]+)\/)?(.*)$/
  async root(request: Request): Promise<Response> {
    const fullPath = new URL(request.url).pathname
    if (fullPath === "/.well-known/deno-import-intellisense.json") {
      return this.autocomplete(fullPath)
    }
    const versionMatch = CodegenServer.rWithCapiVersion.exec(fullPath)
    if (!versionMatch) {
      const defaultVersion = await this.defaultVersion(request)
      return this.redirect(`/@${defaultVersion}${fullPath}`)
    }
    const [, version, path] = versionMatch
    if (version !== this.version) {
      return this.delegateRequest(request, version!, path ?? "/")
    }
    if (!path) return this.redirect(`/@${version}/`)
    if (path === "/") {
      return this.landingPage()
    }
    if (path.startsWith("/proxy/")) {
      const match = CodegenServer.rWithChainUrl.exec(path)
      if (!match) return this.e404()
      const [, chainUrl, chainVersion, file] = match
      return this.chainFile(request, chainUrl!, chainVersion, file!)
    }
    if (path.startsWith("/autocomplete/")) {
      return this.autocomplete(path)
    }
    return this.moduleFile(request, path, `module/${this.version}/${path}`)
  }

  landingPage() {
    return this.html(`<pre>capi@${this.version}</pre>`)
  }

  async chainFile(
    request: Request,
    chainUrl: string,
    chainVersion: string | undefined,
    filePath: string,
  ) {
    if (!chainVersion) {
      const latestChainVersion = await this.latestChainVersion(chainUrl)
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
    const key = `generated/@${this.version}/${chainUrl}/@${chainVersion}/${filePath}`
    const content = await this.cache.getString(
      key,
      chainFileTtl,
      async () => {
        const files = await this.files(chainUrl, chainVersion)
        const content = files.getFormatted(filePath)
        if (content == null) throw this.e404()
        return content
      },
    )
    return this.ts(request, key, content)
  }

  filesMemo = new Map<C.M.Metadata, Files>()
  async files(chainUrl: string, chainVersion: string) {
    const metadata = await this.metadata(chainUrl, chainVersion)
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

  static $index = $.array($.str)
  async chainIndex(chainUrl: string, chainVersion: string) {
    return await this.cache.get(
      `generated/@${this.version}/${chainUrl}/@${chainVersion}/_index`,
      CodegenServer.$index,
      async () => {
        const files = await this.files(chainUrl, chainVersion)
        return [...files.keys()]
      },
    )
  }

  async autocomplete(path: string) {
    if (path === "/.well-known/deno-import-intellisense.json") {
      return this.json({
        version: 2,
        registries: [
          {
            schema: "/:version(@[^/]*)?/:file*",
            variables: [
              { key: "version", url: "/autocomplete/version" },
              { key: "file", url: "/${version}/autocomplete/moduleFile/${file}" },
            ],
          },
          {
            schema:
              "/:version(@[^/]*)/:_proxy(proxy)/:chainUrl(dev:\\w*|wss?:[^/]*)/:chainVersion(@[^/]+)/:file*",
            variables: [
              { key: "version", url: "/autocomplete/version" },
              { key: "_proxy", url: "/autocomplete/null" },
              { key: "chainUrl", url: "/${version}/autocomplete/chainUrl/${chainUrl}" },
              {
                key: "chainVersion",
                url: "/${version}/autocomplete/chainVersion/${chainUrl}/${chainVersion}",
              },
              {
                key: "file",
                url: "/${version}/autocomplete/chainFile/${chainUrl}/${chainVersion}/${file}",
              },
            ],
          },
        ],
      })
    }
    const parts = path.slice(1).split("/")
    if (parts[0] !== "autocomplete") return this.e404()
    if (parts[1] === "null") {
      return this.json({ items: [] })
    }
    if (parts[1] === "version") {
      const versions = await this.versionSuggestions()
      const items = versions.map((v) => "@" + v)
      return this.json({ items, preselect: items[0] })
    }
    if (parts[1] === "chainUrl") {
      return this.json({
        items: [
          ...(this.localChainSupport ? localChains : []),
          ...suggestedChainUrls,
        ],
      })
    }
    if (parts[1] === "chainVersion") {
      const chainUrl = parts[2]!
      const latest = await this.latestChainVersion(chainUrl)
      const other = await this.cache.list(`metadata/${chainUrl}/`)
      const versions = [...new Set([latest, ...other])]
      const items = versions.map((v) => "@" + v)
      return this.json({ items, preselect: items[0] })
    }
    if (parts[1] === "moduleFile") {
      if (parts[2] === "proxy" || parts[2]?.startsWith("@")) return this.json({ items: [] })
      const index = await this.moduleIndex()
      const result = this.autocompleteIndex(index, parts.slice(2))
      if (!parts[3]) {
        result.items.unshift("proxy/")
        result.preselect = "proxy/"
      }
      return this.json(result)
    }
    if (parts[1] === "chainFile") {
      const chainUrl = parts[2]!
      const chainVersion = parts[3]?.slice(1) || await this.latestChainVersion(chainUrl)
      const index = await this.chainIndex(chainUrl, chainVersion)
      return this.json(this.autocompleteIndex(index, parts.slice(4)))
    }
    return this.e404()
  }

  autocompleteIndex(index: string[], partial: string[]) {
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

  acceptsHtml(request: Request) {
    return request.headers.get("Accept")?.split(",").includes("text/html") ?? false
  }

  async ts(request: Request, key: string, body: string) {
    if (!this.acceptsHtml(request)) {
      return new Response(body, {
        headers: {
          "Content-Type": "application/typescript",
        },
      })
    }
    const html = await this.cache.getString(
      `rendered/${key}.html`,
      renderedHtmlTtl,
      async () => {
        const highlighter = await highlighterPromise
        const tokens = highlighter.codeToThemedTokens(body, "ts")
        let codeContent = ""
        for (const line of tokens) {
          codeContent += `<span class="line">`
          for (const token of line) {
            if (
              token.explanation?.every((value) =>
                value.scopes.some((scope) =>
                  scope.scopeName === "meta.export.ts" || scope.scopeName === "meta.import.ts"
                )
                && value.scopes.some((scope) => scope.scopeName === "string.quoted.double.ts")
              )
            ) {
              codeContent += `<a style="color: ${token.color}" href="${
                escapeHtml(JSON.parse(token.content))
              }">${escapeHtml(token.content)}</a>`
            } else {
              codeContent += `<span style="color: ${token.color}">${
                escapeHtml(token.content)
              }</span>`
            }
          }
          codeContent += "</span>\n"
        }
        return `\
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
  a {
    text-decoration-color: transparent;
    transition: text-decoration-color .2s;
    text-underline-offset: 2px;
  }
  a:hover {
    text-decoration-color: currentColor;
  }
</style>
<body>
  <h3><code>${new URL(request.url).pathname}</code></h3>
  <pre class="shiki"><code>${codeContent}</code></pre>
</body>
`
      },
    )
    return this.html(html)
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

  latestChainVersionMemo = new TimedMemo<string, string>(latestChainVersionTtl)
  async latestChainVersion(chainUrl: string) {
    return this.latestChainVersionMemo.run(chainUrl, async () => {
      const client = this.client(chainUrl)
      const chainVersion = U.throwIfError(
        await C.rpcCall("system_version")(client)().as<string>().next(this.normalizeChainVersion)
          .run(),
      )
      return chainVersion
    })
  }

  metadata(chainUrl: string, version: string) {
    return this.cache.get(`metadata/${chainUrl}/${version}`, C.M.$metadata, async () => {
      const client = this.client(chainUrl)
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

  client(chainUrl: string) {
    if (chainUrl.startsWith("dev:")) {
      if (!this.localChainSupport) throw new Error("Dev chains are not supported")
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
