import { blake2_256, hex } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { concat } from "../deps/std/bytes.ts"
import { Signer } from "../frame_metadata/Extrinsic.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
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

export class ExtrinsicRune<out C extends Chain, out U> extends PatternRune<Chain.Call<C>, C, U> {
  static readonly PROTOCOL_VERSION = 4

  $callData = this.chain.into(ValueRune).access("metadata", "extrinsic", "call").into(CodecRune)
  callData = this.$callData.encoded(this)

  $callHash = Rune
    .fn(($inner: $.Codec<unknown>) => blake2_256.$hash($inner))
    .call(this.$callData)
    .into(CodecRune)
  callHash = this.$callHash.encoded(this)

  signed<SU>(signatureFactory: SignatureDataFactory<C, U, SU>) {
    return this.chain.$extrinsic
      .encoded(Rune.object({
        protocolVersion: ExtrinsicRune.PROTOCOL_VERSION,
        call: this,
        signature: signatureFactory(this.chain),
      }))
      .into(SignedExtrinsicRune, this.chain)
  }

  bytes() {
    return this.chain.$extrinsic.encoded(Rune.object({
      protocolVersion: ExtrinsicRune.PROTOCOL_VERSION,
      call: this,
    }))
  }

  feeEstimate() {
    const extrinsic = this.bytes()
    const arg = Rune
      .fn(concat)
      .call(extrinsic, extrinsic.access("length").map((n) => $.u32.encode(n)))
      .map(hex.encodePrefixed)
    const data = this.chain.connection
      .call("state_call", "TransactionPaymentApi_query_info", arg)
      .map(hex.decode)
    return this.chain.metadata
      .access("paths", "sp_weights::weight_v2::Weight")
      .map(($c) => $.field("weight", $c))
      .into(CodecRune)
      .decoded(data)
  }
}
