import * as bindings from "/bindings/mod.ts";
import * as hex from "https://deno.land/std@0.136.0/encoding/hex.ts";
import * as $ from "x/scale/mod.ts";
import { DeriveCodec } from "./Codec.ts";
import * as M from "./Metadata.ts";

// TODO: can this vary depending on chain?
export const $additional = $.tuple(
  $.u32,
  $.u32,
  $.sizedArray($.u8, 32),
  $.sizedArray($.u8, 32),
);

// TODO: CLEAN THIS UP!
export function encodeExtrinsic(
  pubKey: Uint8Array,
  metadata: M.Metadata,
  deriveCodec: DeriveCodec,
  palletName: string,
  methodName: string,
  args: Record<string, unknown>,
  extras: unknown[],
  specVersion: number,
  transactionVersion: number,
  genesisHash: Uint8Array,
  checkpoint: Uint8Array,
  sign?: (message: Uint8Array) => Uint8Array,
): string {
  const uncheckedExtrinsicMetadata = metadata.types[metadata.extrinsic.type];
  if (uncheckedExtrinsicMetadata?._tag !== M.TypeKind.Struct) {
    throw new Error();
  }
  const lookup = uncheckedExtrinsicMetadata.params.reduce<
    Record<"Address" | "Call" | "Signature" | "Extra", number>
  >((acc, cur) => {
    if (!cur.type) {
      throw new Error();
    }
    return { [cur.name]: cur.type, ...acc };
  }, {} as any);
  if (
    lookup.Address === undefined
    || lookup.Call === undefined
    || lookup.Signature === undefined
    || lookup.Extra === undefined
  ) {
    throw new Error();
  }
  const $callCodec = deriveCodec(lookup.Call);
  const callEncoded = $callCodec.encode({
    _tag: palletName,
    0: {
      _tag: methodName,
      ...args,
    },
  });
  const $extraCodec = deriveCodec(lookup.Extra);
  const extraEncoded = $extraCodec.encode(extras);
  const additional = $additional.encode([
    specVersion,
    transactionVersion,
    [...genesisHash] as any,
    [...checkpoint] as any,
  ]);
  const fullUnsignedPayload = new Uint8Array([
    ...callEncoded,
    ...extraEncoded,
    ...additional,
  ]);
  let bytes: number[] = [];
  if (sign) {
    const signature = {
      _tag: "Sr25519",
      0: {
        0: sign(
          fullUnsignedPayload.length > 256
            ? bindings.blake2_256(fullUnsignedPayload)
            : fullUnsignedPayload,
        ),
      },
    };
    const $signatureToEncode = $.tuple(
      $.sizedArray($.u8, 32),
      deriveCodec(lookup.Signature),
      $extraCodec,
    );
    const finalSignature = $signatureToEncode.encode([
      [...pubKey] as any,
      signature,
      extras,
    ]);
    bytes = [
      metadata.extrinsic.version | 128,
      ...finalSignature,
      ...callEncoded,
    ];
  } else {
    bytes = [127, ...callEncoded];
  }
  return new TextDecoder().decode(hex.encode(
    new Uint8Array([
      ...$.compact.encode(bytes.length),
      ...bytes,
    ]),
  ));
}
