import { blake2_256, hex } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { concat } from "../deps/std/bytes.ts"
import { Signer, SignerError } from "../frame_metadata/Extrinsic.ts"
import { is, Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Chain, ChainRune } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { PatternRune } from "./PatternRune.ts"
import { SignedExtrinsicRune } from "./SignedExtrinsicRune.ts"

export interface ExtrinsicSender<C extends Chain> {
  address: Chain.Address<C>
  sign: Signer<C["metadata"]>
}
export function ExtrinsicSender<X, C extends Chain>(
  extrinsicSender: RunicArgs<X, ExtrinsicSender<C>>,
): Rune<ExtrinsicSender<C>, RunicArgs.U<X>> {
  return Rune.object(RunicArgs.resolve(extrinsicSender))
}

export interface SignatureData<C extends Chain> {
  sender: ExtrinsicSender<C>
  extra: Chain.Extra<C>
  additional: Chain.Additional<C>
}

export type SignatureDataFactory<C extends Chain, CU, SU> = (
  chain: ChainRune<C, CU>,
) => Rune<SignatureData<C>, SU>

/** A rune representing an unsigned extrinsic */
export class ExtrinsicRune<out C extends Chain, out U> extends PatternRune<Chain.Call<C>, C, U> {
  static readonly PROTOCOL_VERSION = 4

  /** Get an extrinsic rune of the specified chain and call */
  static from<C extends Chain, U, X>(
    chain: ChainRune<C, U>,
    ...args: RunicArgs<X, [call: Chain.Call<C>]>
  ): ExtrinsicRune<C, U | RunicArgs.U<X>> {
    const [call] = RunicArgs.resolve(args)
    return call.into(ExtrinsicRune, chain)
  }

  /** Get an extrinsic rune of the specified chain and scale-encoded call bytes */
  static fromBytes<C extends Chain, U, X>(
    chain: ChainRune<C, U>,
    ...args: RunicArgs<X, [callBytes: Uint8Array]>
  ) {
    const $call = chain
      .into(ValueRune)
      .access("metadata", "extrinsic", "call")
      .into(CodecRune)
    const call = $call.decoded(args[0])
    return this.from(chain, call.unsafeAs())
  }

  /** Get an extrinsic rune of the specified chain and hex-encoded scale-encoded call string */
  static fromHex<C extends Chain, U, X>(
    chain: ChainRune<C, U>,
    ...[value]: RunicArgs<X, [value: string]>
  ) {
    return this.fromBytes(chain, Rune.resolve(value).map(hex.decode))
  }

  /** A rune representing the call data codec */
  $callData = this.chain.into(ValueRune).access("metadata", "extrinsic", "call").into(CodecRune)

  /** A rune representing the scale-encoded call data */
  callData = this.$callData.encoded(this.unsafeAs())

  /** A rune representing the hex-encoded scale-encoded call data */
  hex = this.callData.map(hex.encode)

  /** A rune representing the call hash codec */
  $callHash = Rune
    .fn(($inner: $.Codec<unknown>) => blake2_256.$hash($inner))
    .call(this.$callData.unsafeAs())
    .into(CodecRune)

  /** A rune representing the call hash */
  callHash = this.$callHash.encoded(this)

  /** Get a signed extrinsic rune representing this extrinsic, signed in accordance with the specified signature factory */
  signed<SU>(signatureFactory: SignatureDataFactory<C, U, SU>) {
    return this.chain.$extrinsic
      .encoded(Rune.object({
        protocolVersion: ExtrinsicRune.PROTOCOL_VERSION,
        call: this,
        signature: signatureFactory(this.chain),
      }))
      .throws(is(SignerError))
      .into(SignedExtrinsicRune, this.chain)
  }

  /** Get the dispatch info of the current extrinsic */
  dispatchInfo() {
    const extrinsic = this.chain.$extrinsic.encoded(Rune.object({
      protocolVersion: ExtrinsicRune.PROTOCOL_VERSION,
      call: this,
    }))
    const arg = Rune
      .fn(concat)
      .call(extrinsic, extrinsic.access("length").map((n) => $.u32.encode(n)))
      .map(hex.encodePrefixed)
    const info = this.chain.connection
      .call("state_call", "TransactionPaymentApi_query_info", arg)
      .map(hex.decode)
    return this.chain.$dispatchInfo.decoded(info)
  }

  /** Get the current extrinsic's weight */
  weight() {
    return this.dispatchInfo().unsafeAs<any>().into(ValueRune).access("weight")
  }

  /** Get the hex-encoded scale-encoded value of the current extrinsic's weight */
  weightRaw() {
    return this.chain.$weight.encoded(this.weight().unsafeAs<never>()).map(hex.encode)
  }

  /** Get the fee estimation for the current extrinsic rune */
  estimate() {
    const encoded = this.chain.connection
      .call("state_call", "TransactionPaymentApi_query_weight_to_fee", this.weightRaw())
      .map(hex.decode)
    return Rune.constant($.u128).into(CodecRune).decoded(encoded)
  }
}
