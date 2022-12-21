import * as $ from "../deps/scale.ts"
import { assert } from "../deps/std/testing/asserts.ts"
import { $multiAddress, $multiSignature, MultiAddress, MultiSignature } from "../primitives/mod.ts"
import { $null, DeriveCodec } from "../reflection/Codec.ts"
import { hashers, Hex, hex, ss58 } from "../util/mod.ts"
import { Metadata } from "./Metadata.ts"

export type Signer =
  | ((message: Uint8Array) => MultiSignature | Promise<MultiSignature>)
  | PolkadotSigner
export interface PolkadotSigner {
  signPayload(payload: any): Promise<{ signature: string }>
}

// TODO: make generic over chain
export interface Extrinsic {
  protocolVersion: number
  signature?:
    & {
      address: MultiAddress
      extra: unknown[]
    }
    & ({ additional: unknown[] } | { sig: MultiSignature })
  call: unknown
}

interface ExtrinsicCodecProps {
  metadata: Metadata
  deriveCodec: DeriveCodec
  sign: Signer
  prefix: number
}

export function $extrinsic(props: ExtrinsicCodecProps): $.Codec<Extrinsic> {
  const { metadata, deriveCodec } = props
  const { signedExtensions } = metadata.extrinsic
  const $multisigPromise = $.promise($multiSignature)
  const callTy = findExtrinsicTypeParam("Call")!
  assert(callTy?.type === "Union")
  const $call = deriveCodec(callTy)
  const [$extra, extraPjsInfo] = getExtensionInfo(pjsExtraKeyMap, "ty")
  const [$additional, additionalPjsInfo] = getExtensionInfo(
    pjsAdditionalKeyMap,
    "additionalSigned",
  )
  const pjsInfo = [...extraPjsInfo, ...additionalPjsInfo]

  const toSignSize = $call._staticSize + $extra._staticSize + $additional._staticSize
  const totalSize = 1 + $multiAddress._staticSize + $multiSignature._staticSize + toSignSize

  const $baseExtrinsic: $.Codec<Extrinsic> = $.createCodec({
    _metadata: [],
    _staticSize: totalSize,
    _encode(buffer, extrinsic) {
      const firstByte = (+!!extrinsic.signature << 7) | extrinsic.protocolVersion
      buffer.array[buffer.index++] = firstByte
      const { signature, call } = extrinsic
      if (signature) {
        $multiAddress._encode(buffer, signature.address)
        if ("additional" in signature) {
          const toSignBuffer = new $.EncodeBuffer(buffer.stealAlloc(toSignSize))
          $call._encode(toSignBuffer, call)
          const callEnd = toSignBuffer.finishedSize + toSignBuffer.index
          if ("signPayload" in props.sign) {
            const exts = [...signature.extra, ...signature.additional]
            const extEnds = []
            for (let i = 0; i < pjsInfo.length; i++) {
              pjsInfo[i]!.codec._encode(toSignBuffer, exts[i])
              extEnds.push(toSignBuffer.finishedSize + toSignBuffer.index)
            }
            const extraEnd = extEnds[extraPjsInfo.length - 1] ?? callEnd
            const toSignEncoded = toSignBuffer.finish()
            const callEncoded = toSignEncoded.subarray(0, callEnd)
            const extraEncoded = toSignEncoded.subarray(callEnd, extraEnd)
            if (signature.address.type !== "Id") {
              throw new Error("polkadot signer: address types other than Id are not supported")
            }
            const payload: Record<string, unknown> = {
              address: ss58.encode(props.prefix, signature.address.value),
              method: hex.encodePrefixed(callEncoded),
              signedExtensions: signedExtensions.map((x) => x.ident),
              version: extrinsic.protocolVersion,
            }
            let last = callEnd
            for (let i = 0; i < pjsInfo.length; i++) {
              const { key } = pjsInfo[i]!
              if (!key) throw new Error("polkadot signer: unknown extension")
              payload[key] = typeof exts[i] === "number"
                ? exts[i]
                : hex.encodePrefixed(toSignEncoded.subarray(last, extEnds[i]!))
              last = extEnds[i]!
            }
            const signer = props.sign
            buffer.writeAsync(0, async (buffer) => {
              const { signature } = await signer.signPayload(payload)
              buffer.insertArray(hex.decode(signature as Hex))
            })
            buffer.insertArray(extraEncoded)
            buffer.insertArray(callEncoded)
          } else {
            $extra._encode(toSignBuffer, signature.extra)
            const extraEnd = toSignBuffer.finishedSize + toSignBuffer.index
            $additional._encode(toSignBuffer, signature.additional)
            const toSignEncoded = toSignBuffer.finish()
            const callEncoded = toSignEncoded.subarray(0, callEnd)
            const extraEncoded = toSignEncoded.subarray(callEnd, extraEnd)
            const toSign = toSignEncoded.length > 256
              ? hashers.Blake2_256.hash(toSignEncoded)
              : toSignEncoded
            const sig = props.sign(toSign)
            if (sig instanceof Promise) {
              $multisigPromise._encode(buffer, sig)
            } else {
              $multiSignature._encode(buffer, sig)
            }
            buffer.insertArray(extraEncoded)
            buffer.insertArray(callEncoded)
          }
        } else {
          $multiSignature._encode(buffer, signature.sig)
          $extra._encode(buffer, signature.extra)
          $call._encode(buffer, call)
        }
      } else {
        $call._encode(buffer, call)
      }
    },
    _decode(buffer) {
      const firstByte = buffer.array[buffer.index++]!
      const hasSignature = firstByte & (1 << 7)
      const protocolVersion = firstByte & ~(1 << 7)
      let signature: Extrinsic["signature"]
      if (hasSignature) {
        const address = $multiAddress._decode(buffer) as MultiAddress
        const sig = $multiSignature._decode(buffer)
        const extra = $extra._decode(buffer)
        signature = { address, sig, extra }
      }
      const call = $call._decode(buffer)
      return { protocolVersion, signature, call }
    },
    _assert(assert) {
      assert.typeof(this, "object")
      assert.key(this, "protocolVersion").equals($.u8, 4)
      const value_ = assert.value as any
      $call._assert(assert.key(this, "call"))
      if (value_.signature) {
        const signatureAssertState = assert.key(this, "signature")
        $multiAddress._assert(signatureAssertState.key(this, "address"))
        $extra._assert(signatureAssertState.key(this, "extra"))
        if ("additional" in value_.signature) {
          $additional._assert(signatureAssertState.key(this, "additional"))
        } else {
          $multiSignature._assert(signatureAssertState.key(this, "sig"))
        }
      }
    },
  })

  return $.withMetadata(
    $.metadata("$extrinsic", $extrinsic, props),
    $.lenPrefixed($baseExtrinsic),
  )

  function findExtrinsicTypeParam(name: string) {
    return metadata.extrinsic.ty.params.find((x) => x.name === name)?.ty
  }
  function getExtensionInfo(
    keyMap: Record<string, string | undefined>,
    key: "ty" | "additionalSigned",
  ): [codec: $.Codec<any>, pjsInfo: { key: string | undefined; codec: $.Codec<any> }[]] {
    const pjsInfo = signedExtensions
      .map((e) => ({ key: keyMap[e.ident], codec: deriveCodec(e[key]) }))
      .filter((x) => x.codec !== $null)
    return [$.tuple(...pjsInfo.map((x) => x.codec)), pjsInfo]
  }
}

const pjsExtraKeyMap: Record<string, string> = {
  CheckEra: "era",
  CheckMortality: "era",
  ChargeTransactionPayment: "tip",
  CheckNonce: "nonce",
}

const pjsAdditionalKeyMap: Record<string, string> = {
  CheckEra: "blockHash",
  CheckMortality: "blockHash",
  CheckSpecVersion: "specVersion",
  CheckTxVersion: "transactionVersion",
  CheckVersion: "specVersion",
  CheckGenesis: "genesisHash",
}
