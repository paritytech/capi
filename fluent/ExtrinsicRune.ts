import { blake2_256, hex } from "../crypto/mod.ts"
import { $extrinsic, Signer } from "../frame_metadata/Extrinsic.ts"
import { Rune, ValueRune } from "../rune/mod.ts"
import { Chain, ChainRune } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
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

export type SignatureDataFactory<C extends Chain, U> = (
  chain: ChainRune<C, U>,
) => Rune<SignatureData<C>, any>

export class ExtrinsicRune<out C extends Chain, out U> extends Rune<Chain.Call<C>, U> {
  hash

  constructor(_prime: ExtrinsicRune<C, U>["_prime"], readonly chain: ChainRune<C, U>) {
    super(_prime)
    this.hash = this.chain
      .into(ValueRune)
      .access("metadata", "extrinsic", "call")
      .map((x) => blake2_256.$hash<any>(x))
      .into(CodecRune)
      .encoded(this)
  }

  signed(signatureFactory: SignatureDataFactory<C, U>) {
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
        protocolVersion: 4,
        call: this,
      }))
  }

  feeEstimate() {
    const extrinsicHex = this.encoded().map(hex.encodePrefixed)
    return this.chain.connection.call("payment_queryInfo", extrinsicHex)
      .map(({ weight, ...rest }) => ({
        ...rest,
        weight: {
          proofSize: BigInt(typeof weight === "number" ? 0 : weight.proof_size),
          refTime: BigInt(typeof weight === "number" ? weight : weight.ref_time),
        },
      }))
  }
}
