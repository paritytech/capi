import { CHAIN_URL_LOOKUP } from "/_/constants/chains/url.ts";
import { call, wsRpcClient } from "/rpc/mod.ts";
import { hashersRuntime } from "/runtime/mod.ts";
import * as hex from "std/encoding/hex.ts";
import * as path from "std/path/mod.ts";
import { IsExact } from "x/conditional_type_checks/mod.ts";
import * as s from "x/scale/mod.ts";
import { DeriveCodec } from "./Codec.ts";
import { encodeKey } from "./Key.ts";
import { Lookup } from "./Lookup.ts";
import * as m from "./Metadata.ts";

export type AssertTrue<_InQuestion extends true> = never;
export type ValidateCodecSignature<
  T,
  C extends s.Codec,
  _IsValid extends IsExact<T, s.Native<C>>,
> = never;

export interface ChainInfo {
  deriveCodec: DeriveCodec;
  metadata: m.Metadata;
  lookup: Lookup;
}

export const getLookupAndDeriveCodec = async (
  networkName: typeof CHAIN_URL_LOOKUP[number][0],
): Promise<ChainInfo> => {
  const metadataEncoded = await Deno.readTextFile(
    path.join("target", "frame_metadata", `${networkName}.scale`),
  );
  const metadata = m.fromPrefixedHex(metadataEncoded);
  const lookup = new Lookup(metadata);
  const deriveCodec = DeriveCodec(metadata);
  return {
    deriveCodec,
    metadata,
    lookup,
  };
};

export const accountId32Bytes = hex.decode(
  new TextEncoder().encode("43fa61b298e82f9f207ddea327900cee26b554756c4a533f36cd875e3e7bcf06"),
);
export const accountId32 = {
  0: [...accountId32Bytes],
};
console.log(accountId32);

export namespace State {
  export const getStorage = async (
    url: typeof CHAIN_URL_LOOKUP[number][1],
    lookup: Lookup,
    deriveCodec: DeriveCodec,
    palletName: string,
    storageEntryName: string,
    ...keys: [] | [unknown] | [unknown, unknown]
  ) => {
    const pallet = lookup.getPalletByName(palletName);
    const storageEntry = lookup.getStorageEntryByPalletAndName(pallet, storageEntryName);
    const key = encodeKey(deriveCodec, hashersRuntime.hashers, pallet, storageEntry, ...keys);
    const client = await wsRpcClient(url);
    const message = await call(client, "state_getStorage", [key]);
    const resultScaleHex = (message as any).result as string | undefined;
    if (resultScaleHex === undefined) {
      return;
    }
    const resultScaleBytes = hex.decode(new TextEncoder().encode(resultScaleHex.substring(2)));
    const valueCodec = deriveCodec(storageEntry.value);
    const decoded = valueCodec.decode(resultScaleBytes);
    await client.close();
    return decoded;
  };
}
