import { blake2_256, hex } from "../crypto/mod.ts"
import { $extrinsic, Signer } from "../frame_metadata/Extrinsic.ts"
import { $ } from "../mod.ts"
import { Rune, ValueRune } from "../rune/mod.ts"
import { Chain, ChainRune } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { PatternRune } from "./PatternRune.ts"
import { SignedExtrinsicRune } from "./SignedExtrinsicRune.ts"

export interface ExtrinsicSender<C extends Chain> {
  address: Chain.Address<C>
  sign: Signer<C["metadata"]>
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
  static PROTOCOL_VERSION = 4

  hash = this.chain
    .into(ValueRune)
    .access("metadata", "extrinsic", "call")
    .map((x) => blake2_256.$hash<any>(x))
    .into(CodecRune)
    .encoded(this)

  signed<SU>(signatureFactory: SignatureDataFactory<C, U, SU>) {
    return Rune.fn($extrinsic)
      .call(this.chain.metadata)
      .into(CodecRune)
      .encoded(Rune.rec({
        protocolVersion: 4,
        call: this,
        signature: signatureFactory(this.chain),
      }))
      .into(SignedExtrinsicRune, this.chain)
  }

  encoded() {
    return Rune.fn($extrinsic)
      .call(this.chain.into(ValueRune).access("metadata"))
      .into(CodecRune)
      .encoded(Rune.rec({
        protocolVersion: ExtrinsicRune.PROTOCOL_VERSION,
        call: this,
      }))
  }

  feeEstimate() {
    const $queryInfoCallArgs = Rune.fn($extrinsic)
      .call(this.chain.into(ValueRune).access("metadata"))
      .map((ext) => $.tuple(ext, $.u32))

    const args = $queryInfoCallArgs
      .into(CodecRune)
      .encoded(Rune.tuple([
        Rune.rec({
          protocolVersion: ExtrinsicRune.PROTOCOL_VERSION,
          call: this,
        }),
        this.encoded().access("length"),
      ]))

    const $transactionPaymentApiQueryInfoResult = $.object(
      $.field("weight", $.object($.field("refTime", $.u64), $.field("proofSize", $.u64))),
    )

    return this.chain.connection.call(
      "state_call",
      "TransactionPaymentApi_query_info",
      args.map(hex.encodePrefixed),
    )
      .map((result) => $transactionPaymentApiQueryInfoResult.decode(hex.decode(result)))
  }
}
