import * as $ from "../deps/scale.ts"
import { register } from "../deps/shims/register-ts-node.ts"
import * as path from "../deps/std/path.ts"
import { NetSpec } from "../nets/mod.ts"

const TS_MODULE_HAS_NO_EXPORTED_MEMBER = 2305
const TS_CANNOT_FIND_MODULE_OR_ITS_CORRESPONDING_TYPE_DECLARATIONS = 2307

const $nets = $.record($.instance(NetSpec as new() => NetSpec, $.tuple(), (_: NetSpec) => []))
const $tsDiagnostics = $.field("diagnosticCodes", $.array($.u32))

export async function resolveNets(maybeNetsPath?: string): Promise<Record<string, NetSpec>> {
  const resolvedNetsPath = await resolveNetsPath(maybeNetsPath)
  if (resolvedNetsPath.endsWith(".ts")) {
    await register()
  }
  // shimmed by dnt
  let nets = await importNets(resolvedNetsPath)
  if ("default" in nets) nets = nets.default
  $.assert($nets, nets)
  for (const key in nets) nets[key]!.name = key
  return nets
}

async function importNets(netsPath: string) {
  try {
    return await _import(netsPath)
  } catch (err) {
    let errorMessage = `Failed to import nets file ${netsPath}.`
    if ($.is($tsDiagnostics, err)) {
      for (const code of new Set(err.diagnosticCodes)) {
        errorMessage += ` Typescript compiler error TS${code}.`
        switch (code) {
          case TS_MODULE_HAS_NO_EXPORTED_MEMBER:
            errorMessage += " Did you import from \"capi/nets\"?"
            break
          case TS_CANNOT_FIND_MODULE_OR_ITS_CORRESPONDING_TYPE_DECLARATIONS:
            errorMessage +=
              " Did you set your tsconfig module to \"ESNext\" and moduleResolution to \"node16\"?"
            break
          default:
            break
        }
      }
    } else {
      console.error(err)
    }
    throw new Error(errorMessage)
  }
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
