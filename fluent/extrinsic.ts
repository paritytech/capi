import * as M from "../frame_metadata/mod.ts"
import { MultiAddress, Signer } from "../primitives/mod.ts"
import { TransactionStatus } from "../rpc/known/mod.ts"
import { MetaRune, Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Era, era } from "../scale_info/mod.ts"
import { Blake2_256 } from "../util/hashers.ts"
import * as U from "../util/mod.ts"
import { ClientRune } from "./client.ts"
import { CodecRune } from "./codec.ts"
import { author, chain, payment, system } from "./rpc_known_methods.ts"

export interface ExtrinsicSender {
  address: MultiAddress
  sign: Signer
}

export interface SignedExtrinsicProps {
  sender: ExtrinsicSender
  checkpoint?: U.HexHash
  mortality?: Era
  nonce?: string
  tip?: bigint
}

export class ExtrinsicRune<out Call, out U> extends Rune<Call, U> {
  constructor(_prime: ExtrinsicRune<Call, U>["_prime"], readonly client: ClientRune<U>) {
    super(_prime)
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
    }).map(M.$extrinsic).as(CodecRune)
    const versions = System.const("Version").decoded.unsafeAs<
      { specVersion: number; transactionVersion: number }
    >().as(ValueRune)
    const specVersion = versions.access("specVersion")
    const transactionVersion = versions.access("transactionVersion")
    // TODO: create match effect in zones and use here
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
    }).unwrapError()
    const nonce = system.accountNextIndex(this.client.as(), senderSs58)
    const genesisHashHex = chain.getBlockHash(this.client.as(), 0).unwrapError()
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
    const extrinsic = $extrinsic.encoded(extrinsicProps).unwrapError()
    return extrinsic.as(SignedExtrinsicRune, this.client)
  }

  encoded() {
    const metadata = this.client.metadata()
    const $extrinsic = Rune.rec({
      metadata,
      deriveCodec: metadata.deriveCodec,
      sign: null!,
      prefix: null!,
    }).map(M.$extrinsic).as(CodecRune)
    const $extrinsicProps = Rune.rec({
      protocolVersion: 4,
      call: this,
    })
    return $extrinsic.encoded($extrinsicProps).unwrapError()
  }

  feeEstimate() {
    const extrinsicHex = this.encoded().map(U.hex.encodePrefixed)
    return payment.queryInfo(this.client, extrinsicHex)
      .unwrapError()
      .map(({ weight, ...rest }) => ({
        ...rest,
        weight: {
          proofSize: BigInt(typeof weight === "number" ? 0 : weight.proof_size),
          refTime: BigInt(typeof weight === "number" ? weight : weight.ref_time),
        },
      }))
  }

  hash() {
    const metadata = this.client.metadata()
    const $callHash = Rune.rec({
      metadata,
      deriveCodec: metadata.deriveCodec,
    }).map((x) => Blake2_256.$hash(M.$call(x))).as(CodecRune)
    return $callHash.encoded(this).unwrapError()
  }
}

export class SignedExtrinsicRune<out U> extends Rune<Uint8Array, U> {
  constructor(_prime: SignedExtrinsicRune<U>["_prime"], readonly client: ClientRune<U>) {
    super(_prime)
  }

  hex() {
    return this.as(ValueRune).map(U.hex.encode)
  }

  sent() {
    return this.hex().map((hex) =>
      author.submitAndWatchExtrinsic(this.client as ClientRune<never>, hex)
        .unwrapError()
    ).as(ExtrinsicStatusRune)
  }
}

export class ExtrinsicStatusRune<out U1, out U2> extends Rune<Rune<TransactionStatus, U1>, U2> {
  constructor(_prime: ExtrinsicStatusRune<U1, U2>["_prime"]) {
    super(_prime)
  }

  logEvents(...prefix: unknown[]): ExtrinsicStatusRune<U1, U2> {
    return this.as(ValueRune).map((rune) =>
      rune.as(ValueRune).map((value) => {
        console.log(...prefix, value)
        return value
      })
    ).as(ExtrinsicStatusRune)
  }

  finalized() {
    return this.as(MetaRune).flatMap((events) =>
      events
        .as(ValueRune)
        .filter(TransactionStatus.isTerminal)
        .map((status) =>
          typeof status !== "string" && status.finalized
            ? status.finalized
            : new NeverFinalizedError()
        )
        .singular()
    ).unwrapError()
  }
}

export class NeverFinalizedError extends Error {}
