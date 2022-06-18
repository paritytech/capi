import * as path from "../_deps/path.ts";
import { CHAIN_URL_LOOKUP } from "../constants/chains/url.ts";
import * as hex from "../util/hex.ts";
import { DeriveCodec } from "./Codec.ts";
import { Lookup } from "./Lookup.ts";
import * as M from "./Metadata.ts";

export interface ChainInfo {
  deriveCodec: DeriveCodec;
  metadata: M.Metadata;
  lookup: Lookup;
}

export async function getLookupAndDeriveCodec(
  networkName: typeof CHAIN_URL_LOOKUP[number][0],
): Promise<ChainInfo> {
  const metadataEncoded = await Deno.readTextFile(
    path.join("frame_metadata", "_downloaded", `${networkName}.scale`),
  );
  const metadata = M.fromPrefixedHex(metadataEncoded);
  const lookup = new Lookup(metadata);
  const deriveCodec = DeriveCodec(metadata);
  return {
    deriveCodec,
    metadata,
    lookup,
  };
}

export const accountId32 = hex.decode(
  "43fa61b298e82f9f207ddea327900cee26b554756c4a533f36cd875e3e7bcf06",
);
