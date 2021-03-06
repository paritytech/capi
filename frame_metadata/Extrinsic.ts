import * as $ from "../deps/scale.ts";
import { $null, DeriveCodec } from "./Codec.ts";
import { HasherLookup } from "./Key.ts";
import { Metadata } from "./Metadata.ts";

export type Era = {
  type: "Mortal";
  value: [period: bigint, phase: bigint];
} | {
  type: "Immortal";
};

export interface MultiAddress {
  type: "Id" | "Index" | "Raw" | "Address20" | "Address32";
  value: Uint8Array;
}

interface Signature {
  type: "Sr25519";
  value: Uint8Array;
}

export type SignExtrinsic = (value: Uint8Array) => Signature;

export interface Extrinsic {
  protocolVersion: number;
  signature?:
    & {
      address: MultiAddress;
      extra: unknown[];
    }
    & ({ additional: unknown[] } | { sig: unknown });
  palletName: string;
  methodName: string;
  args: Record<string, unknown>;
}

interface ExtrinsicCodecProps {
  metadata: Metadata;
  deriveCodec: DeriveCodec;
  hashers: HasherLookup;
  sign: SignExtrinsic;
}

export function $extrinsic(props: ExtrinsicCodecProps): $.Codec<Extrinsic> {
  const { metadata, sign, deriveCodec, hashers: { Blake2_256 } } = props;
  const { signedExtensions } = metadata.extrinsic;
  const $sig = deriveCodec(findExtrinsicTypeParam("Signature")!);
  const $address = deriveCodec(findExtrinsicTypeParam("Address")!);
  const $call = deriveCodec(findExtrinsicTypeParam("Call")!);
  const $extra = getExtrasCodec(signedExtensions.map((x) => x.ty));
  const $additional = getExtrasCodec(signedExtensions.map((x) => x.additionalSigned));
  const $baseExtrinsic: $.Codec<Extrinsic> = $.createCodec({
    _metadata: null,
    _staticSize: 1 + $.tuple($address, $sig, $extra, $call)._staticSize,
    _encode(buffer, extrinsic) {
      const firstByte = (+!!extrinsic.signature << 7) | extrinsic.protocolVersion;
      buffer.array[buffer.index++] = firstByte;
      const call = {
        type: extrinsic.palletName,
        value: {
          type: extrinsic.methodName,
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
      const { type: palletName, value: { type: methodName, ...args } } = call;
      return {
        protocolVersion,
        signature,
        palletName,
        methodName,
        args,
      };
    },
  });

  return $.createCodec({
    _metadata: [$extrinsic, props],
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

  function getExtrasCodec(is: number[]) {
    return $.tuple(...is.map((i) => deriveCodec(i)).filter((x) => x !== $null));
  }
  function findExtrinsicTypeParam(name: string) {
    return metadata.tys[metadata.extrinsic.ty]?.params.find((x) => x.name === name)?.ty;
  }
}
