import * as flags from "../deps/std/flags.ts"
import { parsePathInfo, PathInfo } from "../env/mod.ts"

export async function parseCommand(args: string[]): Promise<Command> {
  const { help, serve: serve_, src, out, capi, "--": cmd } = flags.parse(args, {
    string: ["serve", "src", "out", "capi"],
    boolean: ["help"],
    alias: {
      h: "help",
    },
    "--": true,
  })
  if (help) {
    console.log(Deno.readTextFileSync(new URL(import.meta.resolve("./help.txt"))))
    Deno.exit()
  }

  const port = serve_ === "" ? 8000 : typeof serve_ === "string" ? parseInt(serve_) : undefined
  if (typeof port === "number") {
    try {
      await Deno.connect({ port })
      throw new Error(`Port ${port} already in use`)
    } catch (_e) {}
    if (src || out || capi) throw new Error("Cannot simultaneously `serve` and write flags")
    return {
      type: "serve",
      port,
      ...cmd.length ? { user: cmd } : {},
    }
  }
  if (!(src && out && capi)) throw new Error("Must specify `src`, `out` and `capi`")
  return {
    type: "write",
    pathInfo: parsePathInfo(src),
    out,
    capi,
  }
}

export type Command = ServeCommand | WriteCommand
export interface ServeCommand {
  type: "serve"
  port: number
  user?: string[]
}
export interface WriteCommand {
  type: "write"
  pathInfo: PathInfo
  out: string
  capi: string
}
