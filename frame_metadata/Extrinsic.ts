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

export interface EncodeExtrinsicProps {
  pubKey: Uint8Array;
  metadata: M.Metadata;
  deriveCodec: DeriveCodec;
  palletName: string;
  methodName: string;
  args: Record<string, unknown>;
  extras: unknown[];
  specVersion: number;
  transactionVersion: number;
  genesisHash: Uint8Array;
  checkpoint: Uint8Array;
  sign?: (message: Uint8Array) => Uint8Array;
}

// TODO: CLEAN THIS UP!
export function encodeExtrinsic(p: EncodeExtrinsicProps): string {
  const uncheckedExtrinsicMetadata = p.metadata.types[p.metadata.extrinsic.type];
  if (uncheckedExtrinsicMetadata?._tag !== M.TypeKind.Struct) {
    throw new Error();
  }
  const lookup = Object.fromEntries(uncheckedExtrinsicMetadata.params.map((x) => [x.name, x.type]));
  if (
    lookup.Address === undefined
    || lookup.Call === undefined
    || lookup.Signature === undefined
    || lookup.Extra === undefined
  ) {
    throw new Error();
  }
  const $callCodec = p.deriveCodec(lookup.Call);
  const callEncoded = $callCodec.encode({
    _tag: p.palletName,
    0: {
      _tag: p.methodName,
      ...p.args,
    },
  });
  const $extraCodec = p.deriveCodec(lookup.Extra);
  const extraEncoded = $extraCodec.encode(p.extras);
  const additional = $additional.encode([
    p.specVersion,
    p.transactionVersion,
    [...p.genesisHash] as any,
    [...p.checkpoint] as any,
  ]);
  const fullUnsignedPayload = new Uint8Array([
    ...callEncoded,
    ...extraEncoded,
    ...additional,
  ]);
  let bytes: number[] = [];
  if (p.sign) {
    const signature = {
      _tag: "Sr25519",
      0: {
        0: p.sign(
          fullUnsignedPayload.length > 256
            ? bindings.blake2_256(fullUnsignedPayload)
            : fullUnsignedPayload,
        ),
      },
    };
    const $signatureToEncode = $.tuple(
      $.sizedArray($.u8, 32),
      p.deriveCodec(lookup.Signature),
      $extraCodec,
    );
    const finalSignature = $signatureToEncode.encode([
      [...p.pubKey] as any,
      signature,
      p.extras,
    ]);
    bytes = [
      p.metadata.extrinsic.version | 128,
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
