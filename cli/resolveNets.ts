import * as $ from "../deps/scale.ts"
import { register } from "../deps/shims/register-ts-node.ts"
import * as path from "../deps/std/path.ts"
import { NetSpec } from "../nets/mod.ts"

const $nets = $.record($.instance(NetSpec as new() => NetSpec, $.tuple(), (_: NetSpec) => []))

export async function resolveNets(maybeNetsPath?: string): Promise<Record<string, NetSpec>> {
  const resolvedNetsPath = await resolveNetsPath(maybeNetsPath)
  if (resolvedNetsPath.endsWith(".ts")) {
    await register()
  }
  // shimmed by dnt
  let nets = await _import(resolvedNetsPath)
  if ("default" in nets) nets = nets.default
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

function _import(file: string) {
  return import(path.toFileUrl(file).toString())
}
