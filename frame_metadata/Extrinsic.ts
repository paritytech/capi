import * as $ from "../deps/scale.ts";
import { assert } from "../deps/std/testing/asserts.ts";
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

export interface Signature {
  type: "Sr25519" | "Ed25519" | "Secp256k"; // TODO: `"Ecdsa"`?;
  value: Uint8Array;
}

export type SignExtrinsic = (message: Uint8Array) => Signature | Promise<Signature>;

export interface Extrinsic {
  protocolVersion: number;
  // TODO: make generic over chain
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
  const { metadata, deriveCodec } = props;
  const { signedExtensions } = metadata.extrinsic;
  const $sig = deriveCodec(findExtrinsicTypeParam("Signature")!);
  const $sigPromise = $.promise($sig);
  const $address = deriveCodec(findExtrinsicTypeParam("Address")!);
  const callTyI = findExtrinsicTypeParam("Call")!;
  const callTy = props.metadata.tys[callTyI];
  assert(callTy?.type === "Union");
  const $call = deriveCodec(callTyI);
  const $extra = getExtrasCodec(signedExtensions.map((x) => x.ty));
  const $additional = getExtrasCodec(signedExtensions.map((x) => x.additionalSigned));

  const toSignSize = $call._staticSize + $extra._staticSize + $additional._staticSize;
  const totalSize = 1 + $address._staticSize + $sig._staticSize + toSignSize;

  const $baseExtrinsic: $.Codec<Extrinsic> = $.createCodec({
    _metadata: null,
    _staticSize: totalSize,
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
          const toSignBuffer = new $.EncodeBuffer(buffer.stealAlloc(toSignSize));
          $call._encode(toSignBuffer, call);
          const callEnd = toSignBuffer.finishedSize + toSignBuffer.index;
          $extra._encode(toSignBuffer, signature.extra);
          const extraEnd = toSignBuffer.finishedSize + toSignBuffer.index;
          $additional._encode(toSignBuffer, signature.additional);
          const toSignEncoded = toSignBuffer.finish();
          const callEncoded = toSignEncoded.subarray(0, callEnd);
          const extraEncoded = toSignEncoded.subarray(callEnd, extraEnd);
          const toSign = toSignEncoded.length > 256
            ? props.hashers.Blake2_256(toSignEncoded)
            : toSignEncoded;
          const sig = props.sign(toSign);
          if (sig instanceof Promise) {
            $sigPromise._encode(buffer, sig);
          } else {
            $sig._encode(buffer, sig);
          }
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
      return { protocolVersion, signature, palletName, methodName, args };
    },
  });

  return $.createCodec({
    _metadata: [$extrinsic, props],
    _staticSize: $.nCompact._staticSize + $baseExtrinsic._staticSize,
    _encode(buffer, extrinsic) {
      const lengthCursor = buffer.createCursor($.nCompact._staticSize);
      const contentCursor = buffer.createCursor($baseExtrinsic._staticSize);
      $baseExtrinsic._encode(contentCursor, extrinsic);
      buffer.waitForBuffer(contentCursor, () => {
        const length = contentCursor.finishedSize + contentCursor.index;
        $.nCompact._encode(lengthCursor, length);
        lengthCursor.close();
        contentCursor.close();
      });
    },
    _decode(buffer) {
      const length = $.nCompact._decode(buffer);
      return $baseExtrinsic.decode(buffer.array.subarray(buffer.index, buffer.index += length));
    },
  });

  function findExtrinsicTypeParam(name: string) {
    return metadata.tys[metadata.extrinsic.ty]?.params.find((x) => x.name === name)?.ty;
  }
  function getExtrasCodec(is: number[]) {
    return $.tuple(...is.map((i) => deriveCodec(i)).filter((x) => x !== $null));
  }
}
