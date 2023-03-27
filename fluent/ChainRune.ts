import { hex } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { decodeMetadata, FrameMetadata } from "../frame_metadata/mod.ts"
import { Connection, ConnectionCtorLike } from "../rpc/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { BlockHashRune } from "./BlockHashRune.ts"
import { ConnectionRune } from "./ConnectionRune.ts"
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
  static from<D, M extends FrameMetadata>(
    connectionCtor: ConnectionCtorLike<D>,
    discovery: D,
    staticMetadata?: M,
  ) {
    const connection = ConnectionRune.from(async (signal) =>
      connectionCtor.connect(discovery, signal)
    )
    const metadata = staticMetadata ?? Rune
      .fn(hex.decode)
      .call(connection.call("state_getMetadata"))
      .map(decodeMetadata)
    return Rune.rec({ connection, metadata }).into(this)
  }

  connection = this.into(ValueRune<Chain, U>).access("connection").into(ConnectionRune)

  metadata = this.into(ValueRune).access("metadata")

  latestBlockNum = this.connection
    .subscribe("chain_subscribeNewHeads", "chain_unsubscribeNewHeads")
    .access("number")

  latestBlock = this.connection
    .call("chain_getBlockHash", this.latestBlockNum)
    .unsafeAs<string>()
    .into(BlockHashRune, this)
    .block()

  blockHash<X>(...[blockHash]: RunicArgs<X, [blockHash?: string]>) {
    return Rune
      .resolve(blockHash)
      .unhandle(undefined)
      .rehandle(undefined, () => this.connection.call("chain_getFinalizedHead"))
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
