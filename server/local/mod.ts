import { Handler } from "../../deps/std/http/server.ts"
import { Env, fromPathInfo, parsePathInfo } from "../mod.ts"
import * as f from "./factories.ts"

export function handler(env: Env): Handler {
  return async (req) => {
    const url = new URL(req.url)
    const path = url.pathname.slice(1)
    if (path === "") return new Response("capi dev server active")
    if (path === "capi_cwd") return new Response(Deno.cwd())
    const pathInfo = parsePathInfo(path)
    if (pathInfo) {
      const { vCapi, vRuntime, providerId, generatorId, filePath, target } = pathInfo
      const generatorProviders = env.providers[generatorId]
      if (generatorProviders) {
        const provider = generatorProviders[providerId]
        if (provider) {
          if (vCapi) {
            return f.serverError(
              "The local Capi sever assumes the same version as itself. Another cannot be specified.",
            )
          }
          if (typeof vRuntime !== "string") {
            return await f.serverError("No `vRuntime` in `pathInfo`")
          } else if (vRuntime === "latest") {
            return await f.redirect(
              "/" + fromPathInfo(
                vCapi,
                generatorId,
                providerId,
                target,
                await provider.vRuntime(pathInfo),
                filePath,
              ),
            )
          }
          if (typeof filePath !== "string") {
            return await f.serverError("No `filePath` in `pathInfo`")
          }
          switch (filePath) {
            case "":
              return await f.serverError("TODO: chain root page")
            case "capi.ts": {
              return f.code(req, "capi.ts", `export * from "/mod.ts"`)
            }
            default: {
              const file = (await provider.codegen(pathInfo)).files.get(filePath)
              if (file) return await f.code(req, filePath, file.code(filePath))
            }
          }
        }
      }
    }
    for (const dir of staticDirs) {
      try {
        const url = new URL(path, dir)
        const res = await fetch(url)
        if (!res.ok) continue
        if (f.acceptsHtml(req)) {
          return f.page(await f.codePage({ path: url.toString(), src: await res.text() }))
        }
        return res
      } catch (_e) {}
    }
    return f.notFound()
  }
}

const staticDirs = ["../../", "./static/"].map((p) => import.meta.resolve(p))
