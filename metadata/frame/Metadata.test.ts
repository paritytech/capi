import { _format } from "https://deno.land/std@0.158.0/path/_util.ts"
import { assertSnapshot } from "../../deps/std/testing/snapshot.ts"
import { Metadata } from "./mod.ts"

const kInspect = Symbol.for("Deno.customInspect")

for (
  const name of [
    "polkadot",
    "kusama",
    "statemint",
    "moonbeam",
    "acala",
    "subsocial",
    "westend",
  ] as const
) {
  Deno.test(name, async (t) => {
    const [metadata] = await setup(name)
    await assertSnapshot(t, serializeMetadata(metadata))
  })
}

// Logging the metadata directly yields a finite but pathologically large string.
// This inspect logic shows the expanded form of types only in the top level of the tys array.
// In all other places, it uses an abbreviated form with the id and when applicable the type name.
function serializeMetadata(metadata: Metadata): Metadata {
  let shouldAbbrev = true
  // @ts-ignore .
  metadata.tys[kInspect] = (inspect: any, args: any) => {
    shouldAbbrev = false
    const result = inspect([...metadata.tys], args)
    shouldAbbrev = true
    return result
  }
  for (const ty of metadata.tys) {
    const abbrev = `Ty#${ty.id}` + (ty.path?.length
      ? ` (${ty.path.join("::")})`
      : ty.type === "Primitive"
      ? ` (${ty.kind})`
      : "")
    // @ts-ignore .
    ty[kInspect] = (inspect: any, args: any) => {
      if (shouldAbbrev) {
        return abbrev
      }
      shouldAbbrev = true
      const ty2 = { __proto__: { [Symbol.toStringTag]: abbrev }, ...ty }
      // @ts-ignore .
      delete ty2[kInspect]
      const result = inspect(ty2, args)
      shouldAbbrev = false
      return result
    }
  }
  return metadata
}
