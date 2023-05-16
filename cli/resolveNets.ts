import * as $ from "../deps/scale.ts"
import * as path from "../deps/std/path.ts"
import { NetSpec } from "../nets/mod.ts"

const $nets = $.record($.instance(NetSpec as new() => NetSpec, $.tuple(), () => []))

export async function resolveNets(maybeNetsPath?: string): Promise<Record<string, NetSpec>> {
  let netsPath
  if (maybeNetsPath) {
    netsPath = path.resolve(maybeNetsPath)
    await Deno.stat(netsPath)
  } else {
    for (const p of ["nets.ts", "nets.js"]) {
      try {
        const resolved = path.resolve(p)
        await Deno.stat(resolved)
        netsPath = resolved
      } catch (_e) {}
    }
  }
  if (!netsPath) {
    throw new Error(
      "Could not resolve net specs path. Create a `nets.ts` file and export a net spec.",
    )
  }
  const nets = await import(path.toFileUrl(netsPath).toString())
  $.assert($nets, nets)
  for (const key in nets) nets[key]!.name = key
  return nets
}
