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

/** Contains type utilities pertaining to the `Chain` type */
export namespace Chain {
  export type Call<C extends Chain> = $.Output<C["metadata"]["extrinsic"]["call"]>
  export type Address<C extends Chain> = $.Output<C["metadata"]["extrinsic"]["address"]>
  export type Signature<C extends Chain> = $.Output<C["metadata"]["extrinsic"]["signature"]>
  export type Extra<C extends Chain> = $.Output<C["metadata"]["extrinsic"]["extra"]>
  export type Additional<C extends Chain> = $.Output<C["metadata"]["extrinsic"]["additional"]>

  /** Extract a lookup of the chain's `Pallet`s */
  export type Pallets<C extends Chain> = C["metadata"]["pallets"]
  /** Extract a union of the `Chain`'s pallet names */
  export type PalletName<C extends Chain> = keyof Pallets<C>
  /** Extract the specified `Pallet` of the `Chain` */
  export type Pallet<C extends Chain, P extends PalletName<C>> = Pallets<C>[P]

  /** Extract a lookup of the `Chain`'s `Constant`s */
  export type Constants<C extends Chain, P extends PalletName<C>> = Pallet<C, P>["constants"]
  /** Extract a union of the `Chain`'s constant names */
  export type ConstantName<C extends Chain, P extends PalletName<C>> = keyof Constants<C, P>
  /** Extract the codec that represents a specified constant of the `Chain` */
  export type Constant<C extends Chain, P extends PalletName<C>, K extends ConstantName<C, P>> =
    Constants<C, P>[K]

  /** Contains type utilities pertaining to `Constants` in `FrameMetadata` */
  export namespace Constant {
    /** Get the native TypeScript type of the constant corresponding to the `Chain`, pallet name and constant name */
    export type Value<C extends Chain, P extends PalletName<C>, K extends ConstantName<C, P>> =
      $.Output<Constant<C, P, K>["codec"]>
  }

  /** Extract a lookup of the `Chain`'s `StorageEntry`s */
  export type StorageEntries<C extends Chain, P extends PalletName<C>> = Pallet<C, P>["storage"]
  /** Extract a union of the `Chain`'s storage names */
  export type StorageName<C extends Chain, P extends PalletName<C>> = keyof StorageEntries<C, P>
  /** Extract the codec that represents a specified storage of the `Chain` */
  export type Storage<C extends Chain, P extends PalletName<C>, S extends StorageName<C, P>> =
    StorageEntries<C, P>[S]

  /** Contains type utilities pertaining to `Storage` in `FrameMetadata` */
  export namespace Storage {
    /** Get the native TypeScript type of the storage key corresponding to the `Chain`, pallet name and storage name */
    export type Key<C extends Chain, P extends PalletName<C>, S extends StorageName<C, P>> =
      $.Output<Storage<C, P, S>["key"]>
    export type PartialKey<C extends Chain, P extends PalletName<C>, S extends StorageName<C, P>> =
      $.Output<Storage<C, P, S>["partialKey"]>
    export type Value<C extends Chain, P extends PalletName<C>, S extends StorageName<C, P>> =
      $.Output<Storage<C, P, S>["value"]>
  }
}

/** The root Rune of Capi's fluent API, with which other core Runes can be created */
export class ChainRune<out C extends Chain, out U> extends Rune<C, U> {
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

  with(connect: (signal: AbortSignal) => Connection) {
    const connection = ConnectionRune.from(connect)
    return Rune.object({ connection, metadata: this.metadata }).into(ChainRune) as ChainRune<C, U>
  }

  connection = this.into(ValueRune<Chain, U>).access("connection").into(ConnectionRune)

  metadata = this.into(ValueRune).access("metadata")

  $extrinsic = Rune.fn($extrinsic).call(this.metadata).into(CodecRune)

  latestBlockNum = this.connection
    .subscribe("chain_subscribeNewHeads", "chain_unsubscribeNewHeads")
    .access("number")

  latestBlockHash = this.connection
    .call("chain_getBlockHash", this.latestBlockNum)
    .unsafeAs<string>()
    .into(BlockHashRune, this)

  blockHash<X>(...[blockHash]: RunicArgs<X, [blockHash?: string]>) {
    return Rune
      .resolve(blockHash)
      .handle(is(undefined), () => this.connection.call("chain_getFinalizedHead"))
      .into(BlockHashRune, this)
  }

  extrinsic<X>(...args: RunicArgs<X, [call: Chain.Call<C>]>) {
    const [call] = RunicArgs.resolve(args)
    return call.into(ExtrinsicRune, this.as(ChainRune))
  }

  pallet<P extends Chain.PalletName<C>, X>(...[palletName]: RunicArgs<X, [P]>) {
    return this.metadata
      .access("pallets", palletName)
      .unsafeAs<Chain.Pallet<C, P>>()
      .into(PalletRune, this.as(ChainRune))
  }

  addressPrefix() {
    return this
      .pallet("System")
      .constant("SS58Prefix")
      .decoded
  }

  chainVersion = this.connection.call("system_version")
}

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
