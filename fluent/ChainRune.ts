import { hex } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { decodeMetadata, FrameMetadata } from "../frame_metadata/mod.ts"
import { Connection } from "../rpc/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { BlockRune } from "./BlockRune.ts"
import { connection, ConnectionRune } from "./ConnectionRune.ts"
import { ExtrinsicRune } from "./ExtrinsicRune.ts"
import { PalletRune } from "./PalletRune.ts"

export interface Chain<M extends FrameMetadata = FrameMetadata> {
  connection: Connection
  metadata: M
}

export namespace Chain {
  export type Call<C extends Chain> = $.Native<C["metadata"]["extrinsic"]["call"]>
  export type Address<C extends Chain> = $.Native<C["metadata"]["extrinsic"]["address"]>
  export type Signature<C extends Chain> = $.Native<C["metadata"]["extrinsic"]["signature"]>
  export type Extra<C extends Chain> = $.Native<C["metadata"]["extrinsic"]["extra"]>
  export type Additional<C extends Chain> = $.Native<C["metadata"]["extrinsic"]["additional"]>

  export type Pallets<C extends Chain> = C["metadata"]["pallets"]
  export type PalletName<C extends Chain> = keyof Pallets<C>
  export type Pallet<C extends Chain, P extends PalletName<C>> = Pallets<C>[P]

  export type Constants<C extends Chain, P extends PalletName<C>> = Pallet<C, P>["constants"]
  export type ConstantName<C extends Chain, P extends PalletName<C>> = keyof Constants<C, P>
  export type Constant<C extends Chain, P extends PalletName<C>, K extends ConstantName<C, P>> =
    Constants<C, P>[K]

  export namespace Constant {
    export type Value<C extends Chain, P extends PalletName<C>, K extends ConstantName<C, P>> =
      $.Native<Constant<C, P, K>["codec"]>
  }

  export type StorageEntries<C extends Chain, P extends PalletName<C>> = Pallet<C, P>["storage"]
  export type StorageName<C extends Chain, P extends PalletName<C>> = keyof StorageEntries<C, P>
  export type Storage<C extends Chain, P extends PalletName<C>, S extends StorageName<C, P>> =
    StorageEntries<C, P>[S]

  export namespace Storage {
    export type Key<C extends Chain, P extends PalletName<C>, S extends StorageName<C, P>> =
      $.Native<Storage<C, P, S>["key"]>
    export type PartialKey<C extends Chain, P extends PalletName<C>, S extends StorageName<C, P>> =
      $.Native<Storage<C, P, S>["partialKey"]>
    export type Value<C extends Chain, P extends PalletName<C>, S extends StorageName<C, P>> =
      $.Native<Storage<C, P, S>["value"]>
  }
}

// TODO: do we want to represent the discovery value and conn type within the type system?
export class ChainRune<out C extends Chain, out U> extends Rune<C, U> {
  static from<X, M extends FrameMetadata>(
    props: RunicArgs<X, { connection: Connection; metadata?: M }>,
  ) {
    return Rune
      .rec(props)
      .unsafeAs<{ connection: Connection; metadata: M }>()
      .into(ChainRune)
  }

  static dynamic<D>(
    connectionCtor: {
      new(discovery: D): Connection
      connect: (discovery: D, signal: AbortSignal) => Connection
    },
    discovery: D,
  ) {
    return this.from({
      connection: connection(async (signal) => connectionCtor.connect(discovery, signal)),
    })
  }

  connection = this.into(ValueRune<Chain, U>).access("connection").into(ConnectionRune)

  remoteMetadata = Rune
    .fn(hex.decode)
    .call(this.connection.call("state_getMetadata"))
    .map(decodeMetadata)

  metadata = this
    .into(ValueRune)
    .access("metadata")
    .unsafeAs<FrameMetadata | undefined>()
    .into(ValueRune)
    .unhandle(undefined)
    .rehandle(undefined, () => this.remoteMetadata)

  latestBlock = this.block(
    this.connection
      .call(
        "chain_getBlockHash",
        this.connection
          .subscribe("chain_subscribeNewHeads", "chain_unsubscribeNewHeads")
          .access("number"),
      )
      .unsafeAs<string>(),
  )

  block<X>(...[blockHash]: RunicArgs<X, [blockHash: string]>) {
    return this.connection.call("chain_getBlock", blockHash)
      .unhandle(null)
      .into(BlockRune, this, Rune.resolve(blockHash))
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

  addressPrefix(this: ChainRune<AddressPrefixChain, U>) {
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
