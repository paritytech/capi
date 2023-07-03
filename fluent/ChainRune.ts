import { hex } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { $extrinsic, decodeMetadata, FrameMetadata } from "../frame_metadata/mod.ts"
import { Connection } from "../rpc/mod.ts"
import { is, Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { BlockHashRune } from "./BlockHashRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { ConnectionRune } from "./ConnectionRune.ts"
import { ExtrinsicRune } from "./ExtrinsicRune.ts"
import { PalletRune } from "./PalletRune.ts"

/** A container for the inner connection and FRAME metadata of a given chain */
export interface Chain<M extends FrameMetadata = FrameMetadata> {
  connection: Connection
  metadata: M
}

export namespace Chain {
  export type Call<C extends Chain> = $.Output<C["metadata"]["extrinsic"]["call"]>
  export type Address<C extends Chain> = $.Output<C["metadata"]["extrinsic"]["address"]>
  export type Signature<C extends Chain> = $.Output<C["metadata"]["extrinsic"]["signature"]>
  export type Extra<C extends Chain> = $.Output<C["metadata"]["extrinsic"]["extra"]>
  export type Additional<C extends Chain> = $.Output<C["metadata"]["extrinsic"]["additional"]>

  export type Pallets<C extends Chain> = C["metadata"]["pallets"]
  export type PalletName<C extends Chain> = keyof Pallets<C>
  export type Pallet<C extends Chain, P extends PalletName<C>> = Pallets<C>[P]

  export type Constants<C extends Chain, P extends PalletName<C>> = Pallet<C, P>["constants"]
  export type ConstantName<C extends Chain, P extends PalletName<C>> = keyof Constants<C, P>
  export type Constant<C extends Chain, P extends PalletName<C>, K extends ConstantName<C, P>> =
    Constants<C, P>[K]

  export namespace Constant {
    export type Value<C extends Chain, P extends PalletName<C>, K extends ConstantName<C, P>> =
      $.Output<Constant<C, P, K>["codec"]>
  }

  export type StorageEntries<C extends Chain, P extends PalletName<C>> = Pallet<C, P>["storage"]
  export type StorageName<C extends Chain, P extends PalletName<C>> = keyof StorageEntries<C, P>
  export type Storage<C extends Chain, P extends PalletName<C>, S extends StorageName<C, P>> =
    StorageEntries<C, P>[S]

  export namespace Storage {
    export type Key<C extends Chain, P extends PalletName<C>, S extends StorageName<C, P>> =
      $.Output<Storage<C, P, S>["key"]>
    export type PartialKey<C extends Chain, P extends PalletName<C>, S extends StorageName<C, P>> =
      $.Output<Storage<C, P, S>["partialKey"]>
    export type Value<C extends Chain, P extends PalletName<C>, S extends StorageName<C, P>> =
      $.Output<Storage<C, P, S>["value"]>
  }
}

/** The root Rune of Capi's fluent API, with which other core runes can be created */
export class ChainRune<out C extends Chain, out U> extends Rune<C, U> {
  /** Get a rune representing a chain with the specified connection and (optionally) static metadata */
  static from<M extends FrameMetadata>(
    connect: (signal: AbortSignal) => Connection,
    staticMetadata?: M,
  ) {
    const connection = ConnectionRune.from(connect)
    const metadata = staticMetadata ?? Rune
      .fn(hex.decode)
      .call(connection.call("state_getMetadata"))
      .map(decodeMetadata)
    return Rune.object({ connection, metadata }).into(this)
  }

  /** Get the current chain rune, but with a new inner connection */
  with(connect: (signal: AbortSignal) => Connection) {
    const connection = ConnectionRune.from(connect)
    return Rune.object({ connection, metadata: this.metadata }).into(ChainRune) as ChainRune<C, U>
  }

  /** A rune representing the connection with which to communicate with the chain */
  connection = this.into(ValueRune<Chain, U>).access("connection").into(ConnectionRune)

  /** A rune representing the chain's metadata */
  metadata = this.into(ValueRune).access("metadata")

  /** A rune representing the codec for extrinsics of the current chain */
  $extrinsic = Rune.fn($extrinsic).call(this.metadata).into(CodecRune)

  /** A rune representing a stream of latest block numbers */
  latestBlockNum = this.connection
    .subscribe("chain_subscribeNewHeads", "chain_unsubscribeNewHeads")
    .access("number")

  /** A rune representing a stream of latest block hashes */
  latestBlockHash = this.connection
    .call("chain_getBlockHash", this.latestBlockNum)
    .unsafeAs<string>()
    .into(BlockHashRune, this)

  /** Get a rune representing the specified block hash or the latest finalized block hash */
  blockHash<X>(...[blockHash]: RunicArgs<X, [blockHash?: string]>) {
    return Rune
      .resolve(blockHash)
      .handle(is(undefined), () => this.connection.call("chain_getFinalizedHead"))
      .into(BlockHashRune, this)
  }

  /** Get a rune representing the specified call data */
  extrinsic<X>(...args: RunicArgs<X, [call: Chain.Call<C>]>) {
    const [call] = RunicArgs.resolve(args)
    return call.into(ExtrinsicRune, this.as(ChainRune))
  }

  /** Get a rune representing the specified pallet */
  pallet<P extends Chain.PalletName<C>, X>(...[palletName]: RunicArgs<X, [P]>) {
    return this.metadata
      .access("pallets", palletName)
      .unsafeAs<Chain.Pallet<C, P>>()
      .into(PalletRune, this.as(ChainRune))
  }

  /** Get a rune representing the prefix of the current chain */
  addressPrefix() {
    return this
      .pallet("System")
      .constant("SS58Prefix")
      .decoded
  }

  /** A rune representing the system version */
  chainVersion = this.connection.call("system_version")

  // TODO: narrow type in event selection PR (will include the manually-typed `DispatchInfo`)
  /** A rune representing the chain's dispatch info codec */
  $dispatchInfo = this.metadata
    .access("paths", "frame_support::dispatch::DispatchInfo")
    .into(CodecRune)

  /** A rune representing the chain's weight v2 codec */
  $weight = this.metadata
    .access("paths", "sp_weights::weight_v2::Weight")
    .into(CodecRune)
}

// TODO: rework upon resolution of [#811](https://github.com/paritytech/capi/issues/811)
export interface AddressPrefixChain extends Chain {
  metadata: FrameMetadata & {
    pallets: {
      System: {
        constants: {
          SS58Prefix: {
            codec: $.Codec<number>
          }
        }
      }
    }
  }
}
