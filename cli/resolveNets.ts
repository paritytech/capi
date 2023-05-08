import * as $ from "../deps/scale.ts"
import * as path from "../deps/std/path.ts"
import { NetSpec } from "../nets/mod.ts"

const $nets = $.record($.instance(NetSpec as new() => NetSpec, $.tuple(), () => []))

export async function resolveNets(netsPathRaw = "./nets.ts"): Promise<Record<string, NetSpec>> {
  const netsPath = path.resolve(netsPathRaw)
  await Deno.stat(netsPath)
  const nets = await import(path.toFileUrl(netsPath).toString())
  $.assert($nets, nets)
  for (const key in nets) nets[key]!.name = key
  return nets
}
