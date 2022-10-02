import * as $ from "../deps/scale.ts";
import { assert } from "../deps/std/testing/asserts.ts";
import * as H from "../hashers/mod.ts";
import * as ss58 from "../ss58/mod.ts";
import { hex } from "../util/mod.ts";
import { $null, DeriveCodec } from "./Codec.ts";
import { Metadata } from "./Metadata.ts";

export interface MultiAddress {
  type: "Id" | "Index" | "Raw" | "Address20" | "Address32";
  value: Uint8Array;
}

export interface Signature {
  type: "Sr25519" | "Ed25519" | "Secp256k"; // TODO: `"Ecdsa"`?;
  value: Uint8Array;
}

export type SignExtrinsic =
  | ((message: Uint8Array) => Signature | Promise<Signature>)
  | PolkadotSigner;

export interface PolkadotSigner {
  signPayload(payload: any): Promise<{ signature: string }>;
}

export interface Extrinsic {
  protocolVersion: number;
  // TODO: make generic over chain
  signature?:
    & {
      address: MultiAddress;
      extra: unknown[];
    }
    & ({ additional: unknown[] } | { sig: Signature });
  palletName: string;
  methodName: string;
  args: Record<string, unknown>;
}

interface ExtrinsicCodecProps {
  metadata: Metadata;
  deriveCodec: DeriveCodec;
  sign: SignExtrinsic;
  prefix: number;
}

export function $extrinsic(props: ExtrinsicCodecProps): $.Codec<Extrinsic> {
  const { metadata, deriveCodec } = props;
  const { signedExtensions } = metadata.extrinsic;
  const $sig = deriveCodec(findExtrinsicTypeParam("Signature")!) as $.Codec<Signature>;
  const $sigPromise = $.promise($sig);
  const $address = deriveCodec(findExtrinsicTypeParam("Address")!);
  const callTyI = findExtrinsicTypeParam("Call")!;
  const callTy = props.metadata.tys[callTyI];
  assert(callTy?.type === "Union");
  const $call = deriveCodec(callTyI);
  const [$extra, extraPjsInfo] = getExtensionInfo(pjsExtraKeyMap, "ty");
  const [$additional, additionalPjsInfo] = getExtensionInfo(
    pjsAdditionalKeyMap,
    "additionalSigned",
  );
  const pjsInfo = [...extraPjsInfo, ...additionalPjsInfo];

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
        $address._encode(buffer, signature.address);
        if ("additional" in signature) {
          const toSignBuffer = new $.EncodeBuffer(buffer.stealAlloc(toSignSize));
          $call._encode(toSignBuffer, call);
          const callEnd = toSignBuffer.finishedSize + toSignBuffer.index;
          if ("signPayload" in props.sign) {
            const exts = [...signature.extra, ...signature.additional];
            const extEnds = [];
            for (let i = 0; i < pjsInfo.length; i++) {
              pjsInfo[i]!.codec._encode(toSignBuffer, exts[i]);
              extEnds.push(toSignBuffer.finishedSize + toSignBuffer.index);
            }
            const extraEnd = extEnds[extraPjsInfo.length - 1] ?? callEnd;
            const toSignEncoded = toSignBuffer.finish();
            const callEncoded = toSignEncoded.subarray(0, callEnd);
            const extraEncoded = toSignEncoded.subarray(callEnd, extraEnd);
            if (signature.address.type !== "Id") {
              throw new Error("polkadot signer: address types other than Id are not supported");
            }
            const payload: Record<string, unknown> = {
              address: ss58.encode(props.prefix, signature.address.value),
              method: hex.encodePrefixed(callEncoded),
              signedExtensions: signedExtensions.map((x) => x.ident),
              version: extrinsic.protocolVersion,
            };
            let last = callEnd;
            for (let i = 0; i < pjsInfo.length; i++) {
              const { key } = pjsInfo[i]!;
              if (!key) throw new Error("polkadot signer: unknown extension");
              payload[key] = typeof exts[i] === "number"
                ? exts[i]
                : hex.encodePrefixed(toSignEncoded.subarray(last, extEnds[i]!));
              last = extEnds[i]!;
            }
            const signer = props.sign;
            buffer.writeAsync(0, async (buffer) => {
              const { signature } = await signer.signPayload(payload);
              buffer.insertArray(hex.decode(signature));
            });
            buffer.insertArray(extraEncoded);
            buffer.insertArray(callEncoded);
          } else {
            $extra._encode(toSignBuffer, signature.extra);
            const extraEnd = toSignBuffer.finishedSize + toSignBuffer.index;
            $additional._encode(toSignBuffer, signature.additional);
            const toSignEncoded = toSignBuffer.finish();
            const callEncoded = toSignEncoded.subarray(0, callEnd);
            const extraEncoded = toSignEncoded.subarray(callEnd, extraEnd);
            const toSign = toSignEncoded.length > 256
              ? H.Blake2_256.hash(toSignEncoded)
              : toSignEncoded;
            const sig = props.sign(toSign);
            if (sig instanceof Promise) {
              $sigPromise._encode(buffer, sig);
            } else {
              $sig._encode(buffer, sig);
            }
            buffer.insertArray(extraEncoded);
            buffer.insertArray(callEncoded);
          }
        } else {
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
    _staticSize: $.compactU32._staticSize + $baseExtrinsic._staticSize,
    _encode(buffer, extrinsic) {
      const lengthCursor = buffer.createCursor($.compactU32._staticSize);
      const contentCursor = buffer.createCursor($baseExtrinsic._staticSize);
      $baseExtrinsic._encode(contentCursor, extrinsic);
      buffer.waitForBuffer(contentCursor, () => {
        const length = contentCursor.finishedSize + contentCursor.index;
        $.compactU32._encode(lengthCursor, length);
        lengthCursor.close();
        contentCursor.close();
      });
    },
    _decode(buffer) {
      const length = $.compactU32._decode(buffer);
      return $baseExtrinsic.decode(buffer.array.subarray(buffer.index, buffer.index += length));
    },
  });

  function findExtrinsicTypeParam(name: string) {
    return metadata.tys[metadata.extrinsic.ty]?.params.find((x) => x.name === name)?.ty;
  }
  function getExtensionInfo(
    keyMap: Record<string, string | undefined>,
    key: "ty" | "additionalSigned",
  ): [codec: $.Codec<any>, pjsInfo: { key: string | undefined; codec: $.Codec<any> }[]] {
    const pjsInfo = signedExtensions
      .map((e) => ({ key: keyMap[e.ident], codec: deriveCodec(e[key]) }))
      .filter((x) => x.codec !== $null);
    return [$.tuple(...pjsInfo.map((x) => x.codec)), pjsInfo];
  }
}

const pjsExtraKeyMap: Record<string, string> = {
  CheckEra: "era",
  CheckMortality: "era",
  ChargeTransactionPayment: "tip",
  CheckNonce: "nonce",
};

const pjsAdditionalKeyMap: Record<string, string> = {
  CheckEra: "blockHash",
  CheckMortality: "blockHash",
  CheckSpecVersion: "specVersion",
  CheckTxVersion: "transactionVersion",
  CheckVersion: "specVersion",
  CheckGenesis: "genesisHash",
};
