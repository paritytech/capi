import * as bindings from "/bindings/mod.ts";
import { Raw } from "/primitives/MultiAddress.ts";
import * as hex from "https://deno.land/std@0.136.0/encoding/hex.ts";
import * as $ from "x/scale/mod.ts";
import { DeriveCodec } from "./Codec.ts";
import { display } from "./Display.ts";
import * as M from "./Metadata.ts";

// Call
//   Pallet Index
//   Call Index
//   From Addr
//   Call Args

// Extra (and signed extension stuff?)
//   Mortality
//   Nonce
//   Tip

// Additional
//   Runtime Spec Version
//   Runtime TX version
//   Genesis hash
//   Checkpoint hash –– genesis if immortal. If mortal, should be the block hash provided in era information

// Signature
// If gt 256 bytes, blake2_256 it before signing, otherwise, just sign

export function encodeCall(
  palletI: number,
  callCodec: $.Codec<unknown>,
  methodName: string,
  args: Record<string, unknown>,
) {
  return new Uint8Array([
    ...$.u8.encode(palletI),
    ...callCodec.encode({
      _tag: methodName,
      ...args,
    }),
  ]);
}

export function encodeExtra(
  extraCodec: $.Codec<unknown>,
  extras: unknown[],
) {
  return extraCodec.encode(extras);
}

export const $additional = $.tuple(
  $.u32,
  $.u32,
  $.sizedArray($.u8, 32),
  $.sizedArray($.u8, 32),
);

export function encodeAdditional(
  specVersion: number,
  transactionVersion: number,
  genesisHash: Uint8Array,
  checkpoint: Uint8Array,
) {
  return $additional.encode([
    specVersion,
    transactionVersion,
    [...genesisHash] as any,
    [...checkpoint] as any,
  ]);
}

export function ensureMaxLen(bytes: Uint8Array): Uint8Array {
  if (bytes.length > 256) {
    return bindings.hashersR.hashers.Blake2_256(bytes);
  }
  return bytes;
}
