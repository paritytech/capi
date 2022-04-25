import { CHAIN_URL_LOOKUP } from "/_/constants/chains/url.ts";
import * as hex from "std/encoding/hex.ts";
import * as path from "std/path/mod.ts";
import { IsExact } from "x/conditional_type_checks/mod.ts";
import * as s from "x/scale/mod.ts";
import { DeriveCodec } from "./Codec.ts";
import { Lookup } from "./Lookup.ts";
import * as m from "./Metadata.ts";

export type AssertTrue<_InQuestion extends true> = never;
export type ValidateCodecSignature<
  T,
  C extends s.Codec,
  _IsValid extends IsExact<T, s.Native<C>>,
> = never;

export const getLookupAndDeriveCodec = async (
  networkName: typeof CHAIN_URL_LOOKUP[number][0],
): Promise<[Lookup, DeriveCodec]> => {
  const metadataEncoded = await Deno.readTextFile(
    path.join("target", "frame_metadata", `${networkName}.scale`),
  );
  const metadata = m.fromPrefixedHex(metadataEncoded);
  const lookup = new Lookup(metadata);
  const deriveCodec = DeriveCodec(metadata);
  return [lookup, deriveCodec];
};

export const accountId32Bytes = hex.decode(
  new TextEncoder().encode("43fa61b298e82f9f207ddea327900cee26b554756c4a533f36cd875e3e7bcf06"),
);
export const accountId32 = {
  0: [...accountId32Bytes],
};
