import { ink } from "capi/patterns"
import { client } from "zombienet/examples/ink_e2e/zombienet.toml/collator/@latest/mod.ts"

export const contract = ink.InkMetadataRune.from(
  client,
  Deno.readTextFileSync("examples/ink_e2e/metadata.json"),
)
