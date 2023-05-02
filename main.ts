import "./deps/shims/register.ts"

import bin from "./cli/bin.ts"
import serve from "./cli/serve.ts"
import sync from "./cli/sync.ts"

const commands: Record<string, (...args: string[]) => void> = { bin, serve, sync }

if (Deno.args[0]! in commands) {
  commands[Deno.args[0]!]!(...Deno.args.slice(1))
} else {
  throw new Error("Unrecognized command")
}
