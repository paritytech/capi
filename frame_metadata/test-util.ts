import * as path from "../_deps/path.ts";
import { getHashers } from "../bindings/mod.ts";
import { CHAIN_URL_LOOKUP } from "../constants/chains/url.ts";
import { wsRpcClient } from "../rpc/mod.ts";
import * as hex from "../util/hex.ts";
import { DeriveCodec } from "./Codec.ts";
import { encodeKey } from "./Key.ts";
import { Lookup } from "./Lookup.ts";
import * as M from "./Metadata.ts";

export type AssertTrue<_InQuestion extends true> = never;

export interface ChainInfo {
  deriveCodec: DeriveCodec;
  metadata: M.Metadata;
  lookup: Lookup;
}

export const getLookupAndDeriveCodec = async (
  networkName: typeof CHAIN_URL_LOOKUP[number][0],
): Promise<ChainInfo> => {
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
};

export const accountId32 = hex.decode(
  "43fa61b298e82f9f207ddea327900cee26b554756c4a533f36cd875e3e7bcf06",
);
console.log(accountId32);

export namespace State {
  export async function getStorage(
    url: typeof CHAIN_URL_LOOKUP[number][1],
    lookup: Lookup,
    deriveCodec: DeriveCodec,
    palletName: string,
    storageEntryName: string,
    ...keys: [] | [unknown] | [unknown, unknown]
  ) {
    const pallet = lookup.getPalletByName(palletName);
    const storageEntry = lookup.getStorageEntryByPalletAndName(pallet, storageEntryName);
    const key = encodeKey(deriveCodec, await getHashers(), pallet, storageEntry, ...keys);
    const client = await wsRpcClient(url);
    const message = await client.call("state_getStorage", [key]);
    const resultScaleHex = (message as any).result as string | undefined;
    if (resultScaleHex === undefined) {
      return;
    }
    const resultScaleBytes = hex.decode(resultScaleHex.substring(2));
    const valueCodec = deriveCodec(storageEntry.value);
    const decoded = valueCodec.decode(resultScaleBytes);
    await client.close();
    return decoded;
  }
}
