import { babel, babelPresetTypeScript } from "../deps/escad_babel.ts"
import { contentType } from "../deps/media_types.ts"
import { Application, send } from "../deps/oak.ts"
import * as path from "../deps/std/path.ts"

const dirname = path.dirname(path.fromFileUrl(import.meta.url))

const port = +(Deno.env.get("PORT") ?? "8080")

const transpiledDir = path.join(dirname, "../target/transpiled")

const getTranspiledLocation = (url: string) => path.join(transpiledDir, getTranspiledPath(url))
const getTranspiledPath = (url: string) => {
  return `/${url}`
}
const transpiler = createTranspiler({
  cache: {
    has: async (url) => {
      if (url.startsWith("file://")) return false
      try {
        await Deno.lstat(getTranspiledLocation(url))
        return true
      } catch (e) {
        if (e instanceof Deno.errors.NotFound) {
          return false
        } else {
          throw e
        }
      }
    },
    set: async (url, result) => {
      const loc = getTranspiledLocation(url)
      await Deno.mkdir(path.dirname(loc), { recursive: true })
      await Deno.writeTextFile(loc, result)
    },
  },
  transformUrl: getTranspiledPath,
})

const rootFile = new URL(Deno.args[0]!, path.toFileUrl(Deno.cwd() + "/")).toString()

const app = new Application()

app.use(async (ctx) => {
  let path = ctx.request.url.pathname
  if (ctx.request.url.pathname === "/") {
    transpiler.memo.clear()
    await transpiler.transpile(rootFile)
    path = "/index.html"
  }
  await send(ctx, path, {
    root: transpiledDir,
    contentTypes: new Proxy({}, {
      get: (_target, key) => {
        return contentType(key as string) ?? contentType(".js")
      },
    }),
  })
})

const rootFilePath = getTranspiledPath(transformUrl(rootFile))
await Deno.writeTextFile(
  path.join(transpiledDir, "index.html"),
  `
<script>Deno = { _browserShim: true, args: [], build: { arch: "x86_64" }, errors: { PermissionDenied: Error } }</script>
<script type="module" src="${rootFilePath}"></script>
`.trim(),
)

console.log(`http://localhost:${port}/`)

await app.listen({ port })

function transformUrl(url: string) {
  return url
    .replace(/[?#]/g, "_")
    .replace(/\.\./g, "__")
    .replace(/\.ts$|(?<!\.[^\W\d]+)$/, ".js")
}

interface TranspilerHost {
  cache: {
    has: (url: string) => Promise<boolean>
    set: (url: string, result: string) => Promise<void>
  }
  transformUrl: (url: string) => string
}

interface Transpiler extends TranspilerHost {
  memo: Map<string, Promise<unknown>>
  transpile: (url: string, force?: boolean) => Promise<unknown>
  transpileAll: (urls: string[], force?: boolean) => Promise<unknown>
}

function createTranspiler(ctx: TranspilerHost): Transpiler {
  const memo = new Map<string, Promise<readonly string[]>>()

  return { ...ctx, memo, transpile, transpileAll }

  function transpile(url: string, force = false) {
    return transpileAll([url], force)
  }

  async function transpileAll(urls: string[], force = false) {
    const done = new Set(urls)
    const waiting = urls.map((url) => _transpile(url, force))
    while (waiting.length) {
      for (const dep of await waiting.pop()!) {
        if (done.has(dep)) continue
        done.add(dep)
        waiting.push(_transpile(dep))
      }
    }
  }

  function _transpile(url: string, force = false) {
    if (!force) {
      const running = memo.get(url)
      if (running) {
        return running
      }
    }
    console.log("transpiling", url)
    const prom = (async () => {
      if (!force && await ctx.cache.has(url)) {
        return []
      }
      const [result, deps] = await __transpile(url)
      deps.map((x) => transpile(x))
      await ctx.cache.set(transformUrl(url), result)
      return deps
    })()
    memo.set(url, prom)
    return prom
  }

  async function fetchFile(url: string) {
    const response = await fetch(url)
    if (!response.ok) {
      throw Object.assign(new Error(`Error fetching ${url} for transpilation`), { response })
    }
    const content = await response.text()
    return content
  }

  async function __transpile(url: string) {
    const content = await fetchFile(url)
    const deps: string[] = []
    const result = await babel.transformAsync(content, {
      filename: url,
      presets: [
        [babelPresetTypeScript, {
          allowDeclareFields: true,
        }],
      ],
      plugins: [
        {
          visitor: {
            StringLiteral(path) {
              if (
                ![
                  "ImportDeclaration",
                  "ExportNamedDeclaration",
                  "ExportAllDeclaration",
                ].includes(
                  path.parent.type,
                )
              ) {
                return
              }
              const str = path.node.value
              const resolved = (new URL(str, url)).toString()
              deps.push(resolved)
              path.replaceWith(babel.types.stringLiteral(
                ctx.transformUrl(transformUrl(resolved)),
              ))
              path.skip()
            },
          },
        },
      ],
    })
    if (result?.code == null) throw new Error("Babel returned null")
    return [result.code, deps] as const
  }
}
