import * as $ from "../deps/scale.ts";
import { assert } from "../deps/std/testing/asserts.ts";
import { $null, DeriveCodec } from "./Codec.ts";
import { HasherLookup } from "./Key.ts";
import { Metadata } from "./Metadata.ts";
import { UnionTyDef } from "./scale_info.ts";

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
  type: "Sr25519" | "Ed25519" | "Ecdsa";
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

function encodeCall(
  toSignBuffer: $.EncodeBuffer,
  callTy: UnionTyDef,
  extrinsic: Extrinsic,
  metadata: Metadata,
  deriveCodec: DeriveCodec,
) {
  const palletUnionMember = callTy.members.find((member) => {
    return member.name === extrinsic.palletName;
  })!;
  $.u8._encode(toSignBuffer, palletUnionMember.index);
  const methodsUnionTyI = palletUnionMember.fields[0]?.ty!;
  const methodsUnionTy = metadata.tys[methodsUnionTyI]!;
  assert(methodsUnionTy.type === "Union");
  const methodsUnionMember = methodsUnionTy.members.find((member) => {
    return member.name === extrinsic.methodName;
  })!;
  $.u8._encode(toSignBuffer, methodsUnionMember.index);
  methodsUnionMember.fields.forEach((field) => {
    deriveCodec(field.ty)._encode(toSignBuffer, extrinsic.args[field.name!]);
  });
}

function setup(props: ExtrinsicCodecProps) {
  const { metadata, deriveCodec } = props;
  const { signedExtensions } = metadata.extrinsic;
  const $sig = deriveCodec(findExtrinsicTypeParam("Signature")!);
  const $address = deriveCodec(findExtrinsicTypeParam("Address")!);
  const callTyI = findExtrinsicTypeParam("Call")!;
  const callTy = props.metadata.tys[callTyI];
  assert(callTy?.type === "Union");
  const $call = deriveCodec(callTyI);
  const $extra = getExtrasCodec(signedExtensions.map((x) => x.ty));
  const $additional = getExtrasCodec(signedExtensions.map((x) => x.additionalSigned));

  return { $sig, $address, callTy, $call, $extra, $additional };

  function findExtrinsicTypeParam(name: string) {
    return metadata.tys[metadata.extrinsic.ty]?.params.find((x) => x.name === name)?.ty;
  }
  function getExtrasCodec(is: number[]) {
    return $.tuple(...is.map((i) => deriveCodec(i)).filter((x) => x !== $null));
  }
}

export function $extrinsic(props: ExtrinsicCodecProps): $.Codec<Extrinsic> {
  const { $address, $call, $extra, $sig, callTy, $additional } = setup(props);
  const $baseExtrinsic: $.Codec<Extrinsic> = $.createCodec({
    _metadata: null,
    _staticSize: 1 + $.tuple($address, $sig, $extra, $call)._staticSize,
    _encode: _Encode(props, $address, $call, $extra, $sig, $additional, callTy),
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
}

// TODO: clean this up upon introducing async support to SCALE
export function $encodeAsync(props: ExtrinsicCodecProps) {
  const { $address, $call, $extra, $sig, callTy, $additional } = setup(props);
  const _encode = _Encode(props, $address, $call, $extra, $sig, $additional, callTy);
  const baseStaticSize = 1 + $.tuple($address, $sig, $extra, $call)._staticSize;

  return async (extrinsic: Extrinsic): Promise<Uint8Array> => {
    const baseBuf = new $.EncodeBuffer(baseStaticSize);
    await _encode(baseBuf, extrinsic);
    const baseEncoded = baseBuf.finish();
    const finalBuf = new $.EncodeBuffer($.nCompact._staticSize);
    $.nCompact._encode(finalBuf, baseEncoded.length);
    finalBuf.insertArray(baseEncoded);
    return finalBuf.finish();
  };
}

function _Encode(
  props: ExtrinsicCodecProps,
  $address: $.Codec<unknown>,
  $call: $.Codec<unknown>,
  $extra: $.Codec<unknown[]>,
  $sig: $.Codec<unknown>,
  $additional: $.Codec<unknown[]>,
  callTy: UnionTyDef,
) {
  return async (buffer: $.EncodeBuffer, extrinsic: Extrinsic) => {
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
        // TODO: swap out with use of `$call._encode` upon fixing https://github.com/paritytech/parity-scale-codec-ts/issues/53
        encodeCall(toSignBuffer, callTy, extrinsic, props.metadata, props.deriveCodec);
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
        const sig = await props.sign(toSign);
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
  };
}
