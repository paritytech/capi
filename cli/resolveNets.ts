import * as $ from "../deps/scale.ts"
import * as path from "../deps/std/path.ts"
import { NetSpec } from "../nets/mod.ts"

const $nets = $.record($.instance(NetSpec as new() => NetSpec, $.tuple(), () => []))

export async function resolveNets(maybeNetsPath?: string): Promise<Record<string, NetSpec>> {
  const resolvedNetsPath = await resolveNetsPath(maybeNetsPath)
  const nets = await import(path.toFileUrl(resolvedNetsPath).toString())
  $.assert($nets, nets)
  for (const key in nets) nets[key]!.name = key
  return nets
}

async function resolveNetsPath(maybeNetsPath?: string): Promise<string> {
  if (maybeNetsPath) return path.resolve(maybeNetsPath)
  for (const p of ["nets.ts", "nets.js"]) {
    try {
      const resolved = path.resolve(p)
      await Deno.stat(resolved)
      return resolved
    } catch (_e) {}
  }
  throw new Error(
    "Could not resolve nets path. Create a `nets.ts` or `nets.js` file and export your net specs.",
  )
}
