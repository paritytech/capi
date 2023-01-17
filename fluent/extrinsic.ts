import * as M from "../frame_metadata/mod.ts"
import { MultiAddress, Signer } from "../primitives/mod.ts"
import { TransactionStatus } from "../rpc/known/mod.ts"
import { Args, resolveArgs, Rune } from "../rune/mod.ts"
import { Era, era } from "../scale_info/mod.ts"
import * as U from "../util/mod.ts"
import { ClientRune } from "./client.ts"
import { CodecRune } from "./codec.ts"
import { author, chain, system } from "./rpc_known_methods.ts"

interface ExtrinsicSender {
  address: MultiAddress
  sign: Signer
}

interface SignedExtrinsicProps {
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

  signed<X>(_props: Args<X, SignedExtrinsicProps>) {
    const props = resolveArgs(_props)
    const metadata = this.client.metadata()
    const System = metadata.pallet("System")
    const addrPrefix = System.const("SS58Prefix").decoded.as<number>()
    const $extrinsic = Rune.rec({
      metadata,
      deriveCodec: metadata.deriveCodec,
      sign: props.sender.pipe((x) => x.sign),
      prefix: addrPrefix,
    }).pipe(M.$extrinsic).subclass(CodecRune)
    const versions = System.const("Version").decoded
    const specVersion = versions.pipe((x: any) => x.specVersion).as<number>()
    const transactionVersion = versions.pipe((x: any) => x.transactionVersion).as<number>()
    // TODO: create match effect in zones and use here
    // TODO: MultiAddress conversion utils
    const senderSs58 = Rune.ls([addrPrefix, props.sender]).pipe(([addrPrefix, sender]) => {
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
    const genesisHash = genesisHashHex.pipe(U.hex.decode)
    const checkpointHash = Rune.ls([props.checkpoint, genesisHashHex]).pipe(([a, b]) => a ?? b)
      .pipe(U.hex.decode)
    const mortality = Rune.resolve(props.mortality).pipe((x) => x ?? era.immortal)
    const tip = Rune.resolve(props.tip).pipe((x) => x ?? 0n)
    const extra = Rune.ls([mortality, nonce, tip])
    const additional = Rune.ls([specVersion, transactionVersion, checkpointHash, genesisHash])
    const signature = Rune.rec({
      address: Rune.resolve(props.sender).pipe((x) => x.address),
      extra,
      additional,
    })
    const extrinsicProps = Rune.rec({
      protocolVersion: 4,
      call: this,
      signature,
    })
    const extrinsic = $extrinsic.encoded(extrinsicProps).unwrapError()
    return extrinsic.subclass(SignedExtrinsicRune, this.client)
  }
}

export class SignedExtrinsicRune<out U> extends Rune<Uint8Array, U> {
  constructor(_prime: SignedExtrinsicRune<U>["_prime"], readonly client: ClientRune<U>) {
    super(_prime)
    this.hex = this.pipe(U.hex.encode)
    this.sent = this.hex.pipe((hex) =>
      author.submitAndWatchExtrinsic(this.client as ClientRune<never>, hex)
        .unwrapError()
    ).subclass(ExtrinsicEventsRune)
  }

  hex
  sent
}

export class ExtrinsicEventsRune<out U1, out U2> extends Rune<Rune<TransactionStatus, U1>, U2> {
  constructor(_prime: ExtrinsicEventsRune<U1, U2>["_prime"]) {
    super(_prime)
    this.finalizedHash = this.flatMap((events) =>
      events
        .filter(TransactionStatus.isTerminal)
        .pipe((status) =>
          typeof status !== "string" && status.finalized
            ? status.finalized
            : new NeverFinalizedError()
        )
        .singular()
    )
  }

  logEvents(...prefix: unknown[]): ExtrinsicEventsRune<U1, U2> {
    return this.pipe((rune) =>
      rune.pipe((value) => {
        console.log(...prefix, value)
        return value
      })
    ).subclass(ExtrinsicEventsRune)
  }

  finalizedHash
}

export class NeverFinalizedError extends Error {}
