import { blake2_256 } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { FrameMetadata } from "./FrameMetadata.ts"

export interface Extrinsic<M extends FrameMetadata> {
  protocolVersion: number
  signature?:
    | {
      sender: { address: $.Native<M["extrinsic"]["address"]>; sign: Signer<M> }
      extra: $.Native<M["extrinsic"]["extra"]>
      additional: $.Native<M["extrinsic"]["additional"]>
      sig?: never
    }
    | {
      sender: { address: $.Native<M["extrinsic"]["address"]>; sign?: Signer<M> }
      extra: $.Native<M["extrinsic"]["extra"]>
      additional?: never
      sig: $.Native<M["extrinsic"]["signature"]>
    }
  call: $.Native<M["extrinsic"]["call"]>
}

export type Signer<M extends FrameMetadata> = (
  message: Uint8Array,
  fullData: Uint8Array,
) => $.Native<M["extrinsic"]["signature"]> | Promise<$.Native<M["extrinsic"]["signature"]>>

export function $extrinsic<M extends FrameMetadata>(metadata: M): $.Codec<Extrinsic<M>> {
  const $sig = metadata.extrinsic.signature as $.Codec<$.Native<M["extrinsic"]["signature"]>>
  const $sigPromise = $.promise($sig)
  const $call = metadata.extrinsic.call as $.Codec<$.Native<M["extrinsic"]["call"]>>
  const $address = metadata.extrinsic.address as $.Codec<$.Native<M["extrinsic"]["address"]>>
  const $extra = metadata.extrinsic.extra as $.Codec<$.Native<M["extrinsic"]["extra"]>>
  const $additional = metadata.extrinsic.additional as $.Codec<
    $.Native<M["extrinsic"]["additional"]>
  >

  const toSignSize = $call._staticSize + $extra._staticSize + $additional._staticSize
  const totalSize = 1 + $address._staticSize + $sig._staticSize + toSignSize

  const $baseExtrinsic: $.Codec<Extrinsic<M>> = $.createCodec({
    _metadata: [],
    _staticSize: totalSize,
    _encode(buffer, extrinsic) {
      const firstByte = (+!!extrinsic.signature << 7) | extrinsic.protocolVersion
      buffer.array[buffer.index++] = firstByte
      const { signature, call } = extrinsic
      if (signature) {
        $address._encode(buffer, signature.sender.address)
        if (signature.additional) {
          const toSignBuffer = new $.EncodeBuffer(buffer.stealAlloc(toSignSize))
          $call._encode(toSignBuffer, call)
          const callEnd = toSignBuffer.finishedSize + toSignBuffer.index
          $extra._encode(toSignBuffer, signature.extra)
          const extraEnd = toSignBuffer.finishedSize + toSignBuffer.index
          $additional._encode(toSignBuffer, signature.additional)
          const toSignEncoded = toSignBuffer.finish()
          const callEncoded = toSignEncoded.subarray(0, callEnd)
          const extraEncoded = toSignEncoded.subarray(callEnd, extraEnd)
          const toSign = toSignEncoded.length > 256
            ? blake2_256.hash(toSignEncoded)
            : toSignEncoded
          const sig = signature.sender.sign!(toSign, toSignEncoded)
          if (sig instanceof Promise) {
            $sigPromise._encode(buffer, sig)
          } else {
            $sig._encode(buffer, sig)
          }
          buffer.insertArray(extraEncoded)
          buffer.insertArray(callEncoded)
        } else {
          $sig._encode(buffer, signature.sig!)
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
      let signature: Extrinsic<M>["signature"]
      if (hasSignature) {
        const address = $address._decode(buffer)
        const sig = $sig._decode(buffer)
        const extra = $extra._decode(buffer)
        signature = { sender: { address }, sig, extra }
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
        $address._assert(signatureAssertState.key(this, "sender").key(this, "address"))
        $extra._assert(signatureAssertState.key(this, "extra"))
        if ("additional" in value_.signature) {
          $additional._assert(signatureAssertState.key(this, "additional"))
          signatureAssertState.key(this, "sender").key(this, "sign").typeof(this, "function")
        } else {
          $sig._assert(signatureAssertState.key(this, "sig"))
        }
      }
    },
  })

  return $.withMetadata(
    $.metadata("$extrinsic", $extrinsic, metadata),
    $.lenPrefixed($baseExtrinsic),
  )
}

export class SignerError extends Error {
  override readonly name = "SignerError"

  constructor(readonly inner: unknown) {
    super()
  }
}
