import bin from "./cli/bin.ts"
import serve from "./cli/serve.ts"

const commands: Record<string, (...args: string[]) => void> = { bin, serve }

if (Deno.args[0]! in commands) {
  commands[Deno.args[0]!]!(...Deno.args.slice(1))
} else {
  serve(...Deno.args)
}
