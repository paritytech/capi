import * as flags from "../deps/std/flags.ts"
import * as path from "../deps/std/path.ts"
import { NetConfig } from "../devnets/mod.ts"

export async function resolveConfig(...args: string[]): Promise<Record<string, NetConfig>> {
  const { nets: netsPathRaw } = flags.parse(args, {
    string: ["nets"],
    default: { nets: "./nets.ts" },
  })
  const netsPath = path.resolve(netsPathRaw)
  await Deno.stat(netsPath)
  // TODO: validation a la `scale-ts`
  return await import(path.toFileUrl(netsPath).toString())
}
