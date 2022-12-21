import { assertSnapshot } from "../deps/std/testing/snapshot.ts"
import { $metadata, Metadata } from "./mod.ts"

const kInspect = Symbol.for("Deno.customInspect")

export const downloadedMetadata: {
  acala: Metadata
  kusama: Metadata
  moonbeam: Metadata
  polkadot: Metadata
  statemint: Metadata
  subsocial: Metadata
  westend: Metadata
} = {
  acala: null!,
  kusama: null!,
  moonbeam: null!,
  polkadot: null!,
  statemint: null!,
  subsocial: null!,
  westend: null!,
}

for (const name in downloadedMetadata) {
  Deno.test(`Loads downloaded ${name} metadata`, async () => {
    downloadedMetadata[name as keyof typeof downloadedMetadata] = $metadata.decode(
      (await Deno.readFile(new URL(`${name}.scale`, "frame_metadata/_download"))).slice(2),
    )
  })
}

for (const [name, metadata] of Object.entries(downloadedMetadata)) {
  Deno.test(name, (t) => assertSnapshot(t, serializeMetadata(metadata)))
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
