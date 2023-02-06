import { DeriveCodec } from "../../scale_info/mod.ts"
import { normalize } from "./InkMetadata.ts"

Deno.test("Ink Contract Metadata Normalization and Codec Derivation", async () => {
  const raw = await Deno.readTextFile("patterns/ink/_downloaded/erc20.json")
  const normalized = normalize(JSON.parse(raw))
  const deriveCodec = DeriveCodec(normalized.V3.types)
  for (const ty of normalized.V3.types) deriveCodec(ty.id)
})
