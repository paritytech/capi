import * as M from "../frame_metadata/mod.ts"
import { MultiAddress, Signer } from "../primitives/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Era, era } from "../scale_info/mod.ts"
import { Blake2_256 } from "../util/hashers.ts"
import * as U from "../util/mod.ts"
import { Chain, ClientRune } from "./ClientRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { chain, payment, system } from "./rpc_method_runes.ts"
import { SignedExtrinsicRune } from "./SignedExtrinsicRune.ts"

export interface ExtrinsicSender {
  address: MultiAddress
  sign: Signer
}

export interface SignedExtrinsicProps {
  sender: ExtrinsicSender
  checkpoint?: U.HexHash
  mortality?: Era
  nonce?: number
  tip?: bigint
}

export class ExtrinsicRune<out U, out C extends Chain = Chain> extends Rune<C["call"], U> {
  hash

  constructor(_prime: ExtrinsicRune<U, C>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
    const metadata = this.client.metadata()
    this.hash = Rune.rec({ metadata, deriveCodec: metadata.deriveCodec })
      .map((x) => Blake2_256.$hash(M.$call(x)))
      .into(CodecRune)
      .encoded(this)
  }

  signed<X>(_props: RunicArgs<X, SignedExtrinsicProps>) {
    const props = RunicArgs.resolve(_props)
    const metadata = this.client.metadata()
    const System = metadata.pallet("System")
    const addrPrefix = System.const("SS58Prefix").decoded.unsafeAs<number>()
    const $extrinsic = Rune.rec({
      metadata,
      deriveCodec: metadata.deriveCodec,
      sign: props.sender.access("sign"),
      prefix: addrPrefix,
    }).map(M.$extrinsic).into(CodecRune)
    const versions = System.const("Version").decoded.unsafeAs<
      { specVersion: number; transactionVersion: number }
    >().into(ValueRune)
    const specVersion = versions.access("specVersion")
    const transactionVersion = versions.access("transactionVersion")
    // TODO: create union rune (with `matchTag` method) and utilize here
    // TODO: MultiAddress conversion utils
    const senderSs58 = Rune.tuple([addrPrefix, props.sender]).map(([addrPrefix, sender]) => {
      switch (sender.address.type) {
        case "Id": {
          return U.ss58.encode(addrPrefix, sender.address.value)
        }
        default: {
          throw new Error("unimplemented")
        }
      }
    }).throws(U.ss58.InvalidPublicKeyLengthError, U.ss58.InvalidNetworkPrefixError)
    // TODO: handle props.nonce resolving to undefined
    const nonce = props.nonce ?? system.accountNextIndex(this.client, senderSs58)
    const genesisHashHex = chain.getBlockHash(this.client, 0)
    const genesisHash = genesisHashHex.map(U.hex.decode)
    const checkpointHash = Rune.tuple([props.checkpoint, genesisHashHex]).map(([a, b]) => a ?? b)
      .map(U.hex.decode)
    const mortality = Rune.resolve(props.mortality).map((x) => x ?? era.immortal)
    const tip = Rune.resolve(props.tip).map((x) => x ?? 0n)
    const extra = Rune.tuple([mortality, nonce, tip])
    const additional = Rune.tuple([specVersion, transactionVersion, checkpointHash, genesisHash])
    const signature = Rune.rec({
      address: Rune.resolve(props.sender).access("address"),
      extra,
      additional,
    })
    const extrinsicProps = Rune.rec({
      protocolVersion: 4,
      call: this,
      signature,
    })
    const extrinsic = $extrinsic.encoded(extrinsicProps)
    return extrinsic.into(SignedExtrinsicRune, this.client)
  }

  encoded() {
    const metadata = this.client.metadata()
    const $extrinsic = Rune.rec({
      metadata,
      deriveCodec: metadata.deriveCodec,
      sign: null!,
      prefix: null!,
    }).map(M.$extrinsic).into(CodecRune)
    const $extrinsicProps = Rune.rec({
      protocolVersion: 4,
      call: this,
    })
    return $extrinsic.encoded($extrinsicProps)
  }

  feeEstimate() {
    const extrinsicHex = this.encoded().map(U.hex.encodePrefixed)
    return payment.queryInfo(this.client, extrinsicHex)
      .map(({ weight, ...rest }) => ({
        ...rest,
        weight: {
          proofSize: BigInt(typeof weight === "number" ? 0 : weight.proof_size),
          refTime: BigInt(typeof weight === "number" ? weight : weight.ref_time),
        },
      }))
  }
}
