import { unimplemented } from "../deps/std/testing/asserts.ts"
import * as Z from "../deps/zones.ts"
import { MultiAddress, Signer } from "../primitives/mod.ts"
import * as rpc from "../rpc/mod.ts"
import { era } from "../scale_info/mod.ts"
import { Blake2_256 } from "../util/hashers.ts"
import * as U from "../util/mod.ts"
import { const as const_ } from "./const.ts"
import { metadata } from "./metadata.ts"
import { author, chain, payment, system } from "./rpc_known_methods.ts"
import * as scale from "./scale.ts"

const k0_ = Symbol()

export interface ExtrinsicProps<Call = unknown> {
  sender: MultiAddress
  checkpoint?: U.HexHash
  mortality?: [period: bigint, phase: bigint]
  nonce?: string
  tip?: bigint
  call: Call
}

export function extrinsic<Client extends Z.$<rpc.Client>, Call = unknown>(client: Client) {
  return <Props extends Z.Rec$<ExtrinsicProps<Call>>>(props: Props): Extrinsic<Client, Props> => {
    return new Extrinsic(client, props)
  }
}

export class Extrinsic<
  Client extends Z.$<rpc.Client> = Z.$<rpc.Client>,
  Props extends Z.Rec$<ExtrinsicProps> = Z.Rec$<ExtrinsicProps>,
> {
  constructor(
    readonly client: Client,
    readonly props: Props,
  ) {}

  signed<Sign extends Z.$<Signer>>(sign: Sign): SignedExtrinsic<Client, Props, Sign> {
    return new SignedExtrinsic(this.client, this.props, sign)
  }

  get feeEstimate() {
    const $extrinsic_ = $extrinsic(this.client)
    const $extrinsicProps = Z.rec({
      protocolVersion: 4,
      call: this.props.call,
    })
    const extrinsicBytes = scale.scaleEncoded($extrinsic_, $extrinsicProps, true)
    const extrinsicHex = extrinsicBytes.next(U.hex.encodePrefixed)
    return payment.queryInfo(this.client)(extrinsicHex)
      .next(({ weight, ...rest }) => ({
        ...rest,
        weight: {
          proofSize: BigInt(typeof weight === "number" ? 0 : weight.proof_size),
          refTime: BigInt(typeof weight === "number" ? weight : weight.ref_time),
        },
      }))
  }

  get callHash() {
    return callHash(this.client)(this.props.call)
  }
}

export class SignedExtrinsic<
  Client extends Z.$<rpc.Client> = Z.$<rpc.Client>,
  Props extends Z.Rec$<ExtrinsicProps> = Z.Rec$<ExtrinsicProps>,
  Sign extends Z.$<Signer> = Z.$<Signer>,
> {
  client
  props
  sign
  extrinsicBytes
  extrinsicHex
  extrinsicDecoded

  constructor(
    client: Client,
    props: Props,
    sign: Sign,
  ) {
    this.client = client as Client
    this.props = props as Z.Rec$Access<Props>
    this.sign = sign as Sign

    const addrPrefix = const_(this.client)("System", "SS58Prefix")
      .access("value")
      .as<number>()
    const $extrinsic_ = $extrinsic(this.client, this.sign)
    const versions = const_(this.client)("System", "Version")
      .access("value")
    const specVersion = versions
      .access("specVersion").as<number>()
    const transactionVersion = versions
      .access("transactionVersion").as<number>()
    // TODO: create match effect in zones and use here
    // TODO: MultiAddress conversion utils
    const senderSs58 = Z.ls(addrPrefix, this.props.sender).next(([addrPrefix, sender]) => {
      switch (sender.type) {
        case "Id": {
          return U.returnThrows<U.ss58.EncodeError>()(() => U.ss58.encode(addrPrefix, sender.value))
        }
        default: {
          unimplemented()
        }
      }
    }, k0_)
    const nonce = system.accountNextIndex(this.client)(senderSs58)
    const genesisHashBytes = chain.getBlockHash(this.client)(0)
    const genesisHash = genesisHashBytes.next(U.hex.decode)
    const checkpointHash = this.props.checkpoint
      ? Z.option(this.props.checkpoint, U.hex.decode)
      : genesisHash
    const mortality = Z
      .lift(this.props.mortality)
      .next((mortality) => {
        return mortality
          ? era.mortal(mortality[0], mortality[1])
          : era.immortal
      })
    const extra = Z.ls(mortality, nonce, this.props.tip || 0n)
    const additional = Z.ls(specVersion, transactionVersion, checkpointHash, genesisHash)
    const signature = Z.rec({ address: this.props.sender, extra, additional })
    const $extrinsicProps = Z.rec({
      protocolVersion: 4,
      call: this.props.call,
      signature,
    })
    this.extrinsicBytes = scale.scaleEncoded($extrinsic_, $extrinsicProps, true)
    this.extrinsicHex = this.extrinsicBytes.next(U.hex.encodePrefixed)
    this.extrinsicDecoded = scale.scaleDecoded($extrinsic_, this.extrinsicBytes, "extrinsic")
  }

  watch<
    Listener extends Z.$<
      U.CreateListener<rpc.ClientSubscriptionContext, rpc.known.TransactionStatus>
    >,
  >(
    listener: Listener,
  ) {
    return author.submitAndWatchExtrinsic(this.client)([this.extrinsicHex], listener)
  }

  get sent() {
    return author.submitExtrinsic(this.client)(this.extrinsicHex)
  }
}

// TODO: attach to extrinsics sent.finalized result once zones-level method addition implemented
export function extrinsicsDecoded<Client extends Z.$<rpc.Client>>(client: Client) {
  return <Hexes extends Z.$<rpc.known.Hex[]>>(hexes: Hexes) =>
    Z.ls($extrinsic(client), hexes).next(([$extrinsic, hexes]) =>
      hexes.map((hex) => $extrinsic.decoded(U.hex.decode(hex)))
    )
}

// TODO: ensure that ss58 encoding failure is represented in `U` of to-be `ExtrinsicRune`
function $extrinsic<
  Client extends Z.$<rpc.Client> = Z.$<rpc.Client>,
  Rest extends [sign?: Z.$<Signer>] = [sign?: Z.$<Signer>],
>(client: Client, ...[sign]: Rest) {
  const metadata_ = metadata(client)()
  const deriveCodec_ = scale.deriveCodec(metadata_)
  const addrPrefix = const_(client)("System", "SS58Prefix")
    .access("value")
    .as<number>()
  return scale.$extrinsic(deriveCodec_, metadata_, sign!, addrPrefix)
}

function $call<
  Client extends Z.$<rpc.Client> = Z.$<rpc.Client>,
>(client: Client) {
  const metadata_ = metadata(client)()
  const deriveCodec_ = scale.deriveCodec(metadata_)
  return scale.$call(deriveCodec_, metadata_)
}

export function callHash<
  Client extends Z.$<rpc.Client> = Z.$<rpc.Client>,
  Call extends Z.$<unknown> = Z.$<unknown>,
>(client: Client) {
  return (call: Call) => {
    return Z.ls($call(client), call).next(([codec, call]) => {
      return Blake2_256.hash(codec.encode(call))
    })
  }
}
