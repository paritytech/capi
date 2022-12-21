import * as U from "../util/mod.ts"
import { $metadata, Metadata } from "./mod.ts"

const downloadedMetadata: {
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
  const metadataUrl = new URL(`./_downloaded/${name}.scale`, import.meta.url)
  const metadataBytes = U.hex.decodeBuf((await Deno.readFile(metadataUrl)).slice(2))
  const metadata = $metadata.decode(metadataBytes)
  downloadedMetadata[name as keyof typeof downloadedMetadata] = metadata
}

export { downloadedMetadata }
