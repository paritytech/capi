import * as bindings from "/bindings/mod.ts";
import * as P from "/primitives/mod.ts";
import * as hex from "/util/hex.ts";
import * as $ from "x/scale/mod.ts";
import { DeriveCodec } from "./Codec.ts";
import { Metadata, TypeKind } from "./Metadata.ts";

// TODO: clean this up
export function getExtrinsicCodecs(metadata: Metadata, deriveCodec: DeriveCodec) {
  const uncheckedExtrinsicMetadata = metadata.types[metadata.extrinsic.type];
  if (uncheckedExtrinsicMetadata?._tag !== TypeKind.Struct) {
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
  const $callCodec = deriveCodec(lookup.Call);
  const $extraCodec = deriveCodec(lookup.Extra);
  const $signatureCodec = deriveCodec(lookup.Signature);
  // TODO: can this vary depending on chain?
  const $additional = $.tuple(
    $.u32,
    $.u32,
    $.sizedArray($.u8, 32),
    $.sizedArray($.u8, 32),
  ) as $.Codec<unknown>;
  const $signatureToEncode = $.tuple($.sizedArray($.u8, 32), $signatureCodec, $extraCodec) as $.Codec<unknown>;
  return {
    $callCodec,
    $extraCodec,
    $signatureCodec,
    $additional,
    $signatureToEncode,
  };
}

export interface EncodeExtrinsicProps {
  $callCodec: $.Codec<unknown>;
  $extraCodec: $.Codec<unknown>;
  $signatureCodec: $.Codec<unknown>;
  $additional: $.Codec<unknown>;
  $signatureToEncode: $.Codec<unknown>;
  pubKey: Uint8Array;
  palletName: string;
  methodName: string;
  args: Record<string, unknown>;
  extrinsicVersion: number;
  extras: P.Extras;
  specVersion: number;
  transactionVersion: number;
  genesisHash: Uint8Array;
  checkpoint: Uint8Array;
  sign?: (message: Uint8Array) => Uint8Array;
}

// TODO: CLEAN THIS UP!
export function encodeExtrinsic(p: EncodeExtrinsicProps): string {
  const callEncoded = p.$callCodec.encode(new P.Call(p.palletName, p.methodName, p.args));
  const extraEncoded = p.$extraCodec.encode(p.extras);
  const additional = p.$additional.encode([p.specVersion, p.transactionVersion, [...p.genesisHash], [...p.checkpoint]]);
  const unsigned = new Uint8Array([...callEncoded, ...extraEncoded, ...additional]);
  let bytes: number[];
  if (p.sign) {
    const lenNormalized = unsigned.length > 256 ? bindings.blake2_256(unsigned) : unsigned;
    const signature = new P.Sr25519Signature(p.sign(lenNormalized));
    const finalSignature = p.$signatureToEncode.encode([[...p.pubKey], signature, p.extras]);
    bytes = [p.extrinsicVersion | 128, ...finalSignature, ...callEncoded];
  } else {
    bytes = [127, ...callEncoded];
  }
  return hex.encode(new Uint8Array([...$.compact.encode(bytes.length), ...bytes]));
}

// TODO: move encoding logic into this codec
function $Extrinsic(metadata: Metadata, deriveCodec: DeriveCodec) {
  const codecs = getExtrinsicCodecs(metadata, deriveCodec);
  return $.createCodec({
    _staticSize: 0,
    _encode: undefined!,
    _decode(buffer) {
      const length = $.compact._decode(buffer);
      const prefix = $.u8._decode(buffer);
      const signed = {
        128: true,
        127: false,
      }[metadata.extrinsic.version ^ prefix];
      if (signed === undefined) {
        throw new Error();
      }
      // TODO: type this as well as possible
      let signature: any;
      if (signed) {
        signature = codecs.$signatureToEncode._decode(buffer);
      }
      const call = codecs.$callCodec._decode(buffer);
      // TODO: type this as well as possible
      const decoded: any = {
        length,
        call,
      };
      if (signature) {
        decoded.pubKey = signature[0];
        decoded.signature = signature[1];
        decoded.extras = signature[2];
      }
      return decoded;
    },
  });
}

export function decodeExtrinsic(metadata: Metadata, deriveCodec: DeriveCodec, bytes: Uint8Array) {
  return $Extrinsic(metadata, deriveCodec).decode(bytes);
}
