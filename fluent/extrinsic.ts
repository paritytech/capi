import * as M from "../frame_metadata/mod.ts"
import { MultiAddress, Signer } from "../primitives/mod.ts"
import { TransactionStatus } from "../rpc/known/mod.ts"
import { MetaRune, Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Era, era } from "../scale_info/mod.ts"
import { Blake2_256 } from "../util/hashers.ts"
import * as U from "../util/mod.ts"
import { Hex } from "../util/mod.ts"
import { Chain, ClientRune } from "./client.ts"
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
    }).throws(U.ss58.InvalidPublicKeyLengthError, U.ss58.InvalidNetworkPrefixError)
    const nonce = system.accountNextIndex(this.client.into(), senderSs58)
    const genesisHashHex = chain.getBlockHash(this.client.into(), 0)
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

export class SignedExtrinsicRune<out U, out C extends Chain = Chain> extends Rune<Uint8Array, U> {
  constructor(_prime: SignedExtrinsicRune<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }

  hex() {
    return this.into(ValueRune).map(U.hex.encode)
  }

  sent() {
    return this.hex().map((hex) =>
      author.submitAndWatchExtrinsic(this.client as ClientRune<never, C>, hex)
    ).into(ExtrinsicStatusRune, this)
  }
}

export class ExtrinsicStatusRune<out U1, out U2, out C extends Chain = Chain>
  extends Rune<Rune<TransactionStatus, U1>, U2>
{
  constructor(
    _prime: ExtrinsicStatusRune<U1, U2, C>["_prime"],
    readonly extrinsic: SignedExtrinsicRune<U2, C>,
  ) {
    super(_prime)
  }

  logStatus(...prefix: unknown[]): ExtrinsicStatusRune<U1, U2, C> {
    return this.into(ValueRune).map((rune) =>
      rune.into(ValueRune).map((value) => {
        console.log(...prefix, value)
        return value
      })
    ).into(ExtrinsicStatusRune<U1, U2, C>, this.extrinsic)
  }

  finalized() {
    return this.into(MetaRune).flatMap((events) =>
      events
        .into(ValueRune)
        .filter(TransactionStatus.isTerminal)
        .map((status) =>
          typeof status !== "string" && status.finalized
            ? status.finalized
            : new NeverFinalizedError()
        )
        .singular()
    ).unhandle(NeverFinalizedError)
  }

  events() {
    const finalizedHash = this.finalized()
    const extrinsics = chain
      .getBlock(this.extrinsic.client, finalizedHash)
      .access("block", "extrinsics")
    const idx = Rune.tuple([extrinsics, this.extrinsic.hex()])
      .map(([extrinsics, extrinsicHex]) => extrinsics.indexOf(("0x" + extrinsicHex) as Hex))
    const events = this.extrinsic.client
      .metadata()
      .pallet("System")
      .storage("Events")
      .entry([], finalizedHash)
      .unsafeAs<Events<C["event"]>>()
      .into(ValueRune)
    return Rune.tuple([idx, events])
      .map(([idx, events]) =>
        events.filter((event) => event.phase.type === "ApplyExtrinsic" && event.phase.value === idx)
      )
  }
}

export type Events<RuntimeEvent = unknown> = EventRecord<RuntimeEvent>[]
export interface EventRecord<RuntimeEvent> {
  phase: EventPhase
  event: RuntimeEvent
  topics: Uint8Array[]
}
export type EventPhase =
  | EventPhase.ApplyExtrinsic
  | EventPhase.Finalization
  | EventPhase.Initialization
export namespace EventPhase {
  export interface ApplyExtrinsic {
    type: "ApplyExtrinsic"
    value: number
  }
  export interface Finalization {
    type: "Finalization"
  }
  export interface Initialization {
    type: "Initialization"
  }
}

export class NeverInBlockError extends Error {}
export class NeverFinalizedError extends Error {}
