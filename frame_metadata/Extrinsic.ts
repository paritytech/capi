import { $null, DeriveCodec } from "/frame_metadata/Codec.ts";
import { HasherLookup } from "/frame_metadata/Key.ts";
import { Metadata } from "/frame_metadata/Metadata.ts";
import { MultiAddress } from "/primitives/mod.ts";
import * as $ from "x/scale/mod.ts";

export interface Extrinsic {
  protocolVersion: number;
  signature?: {
    address: MultiAddress;
    extra: unknown[];
    additional: unknown[];
  } | {
    address: MultiAddress;
    sig: unknown;
    extra: unknown[];
  };
  palletName: string;
  methodName: string;
  args: Record<string, unknown>;
}

interface ExtrinsicCodecArgs {
  metadata: Metadata;
  deriveCodec: DeriveCodec;
  hashers: HasherLookup;
  sign: (value: Uint8Array) => unknown;
}

export function createExtrinsicCodec(
  { metadata, sign, deriveCodec, hashers: { Blake2_256 } }: ExtrinsicCodecArgs,
) {
  const { signedExtensions } = metadata.extrinsic;
  const $sig = deriveCodec(findExtrinsicTypeParam("Signature")!);
  const $address = deriveCodec(findExtrinsicTypeParam("Address")!);
  const $call = deriveCodec(findExtrinsicTypeParam("Call")!);
  const $extra = getExtrasCodec(signedExtensions.map((x) => x.type));
  const $additional = getExtrasCodec(signedExtensions.map((x) => x.additionalSigned));
  const $baseExtrinsic = $.createCodec<Extrinsic>({
    _staticSize: 1 + $.tuple($address, $sig, $extra, $call)._staticSize,
    _encode(buffer, extrinsic) {
      const firstByte = (+!!extrinsic.signature << 7) | extrinsic.protocolVersion;
      buffer.array[buffer.index++] = firstByte;
      const call = {
        _tag: extrinsic.palletName,
        value: {
          _tag: extrinsic.methodName,
          ...extrinsic.args,
        },
      };
      const { signature } = extrinsic;
      if (signature) {
        if ("additional" in signature) {
          $address._encode(buffer, signature.address);
          const toSignBuffer = new $.EncodeBuffer($.tuple($sig, $extra, $additional)._staticSize);
          $call._encode(toSignBuffer, call);
          const callEnd = toSignBuffer.finishedSize + toSignBuffer.index;
          $extra._encode(toSignBuffer, signature.extra);
          const extraEnd = toSignBuffer.finishedSize + toSignBuffer.index;
          $additional._encode(toSignBuffer, signature.additional);
          const toSignEncoded = toSignBuffer.finish();
          const callEncoded = toSignEncoded.subarray(0, callEnd);
          const extraEncoded = toSignEncoded.subarray(callEnd, extraEnd);
          const toSign = toSignEncoded.length > 256 ? Blake2_256(toSignEncoded) : toSignEncoded;
          const sig = sign(toSign);
          $sig._encode(buffer, sig);
          buffer.insertArray(extraEncoded);
          buffer.insertArray(callEncoded);
        } else {
          $address._encode(buffer, signature.address);
          $sig._encode(buffer, signature.sig);
          $extra._encode(buffer, signature.extra);
          $call._encode(buffer, call);
        }
      } else {
        $call._encode(buffer, call);
      }
    },
    _decode(buffer) {
      const firstByte = buffer.array[buffer.index++]!;
      const hasSignature = firstByte & (1 << 7);
      const protocolVersion = firstByte & ~(1 << 7);
      let signature: Extrinsic["signature"];
      if (hasSignature) {
        const address = $address._decode(buffer) as MultiAddress;
        const sig = $sig._decode(buffer);
        const extra = $extra._decode(buffer);
        signature = { address, sig, extra };
      }
      const call = $call._decode(buffer) as any;
      const { _tag: palletName, value: { _tag: methodName, ...args } } = call;
      return {
        protocolVersion,
        signature,
        palletName,
        methodName,
        args,
      };
    },
  });

  const $extrinsic = $.createCodec<Extrinsic>({
    _staticSize: $.nCompact._staticSize,
    _encode(buffer, extrinsic) {
      const encoded = $baseExtrinsic.encode(extrinsic);
      $.nCompact._encode(buffer, encoded.length);
      buffer.insertArray(encoded);
    },
    _decode(buffer) {
      const length = $.nCompact._decode(buffer);
      return $baseExtrinsic.decode(buffer.array.subarray(buffer.index, buffer.index += length));
    },
  });

  return $extrinsic;

  function getExtrasCodec(is: number[]) {
    return $.tuple(...is.map((i) => deriveCodec(i)).filter((x) => x !== $null));
  }
  function findExtrinsicTypeParam(name: string) {
    return metadata.types[metadata.extrinsic.type]?.params.find((x) => x.name === name)?.type;
  }
}
