import { hex } from "../crypto/mod.ts"
import * as $ from "../deps/scale.ts"
import { decodeMetadata, FrameMetadata } from "../frame_metadata/mod.ts"
import { Connection, ConnectionCtorLike } from "../rpc/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { U2I } from "../util/mod.ts"
import { BlockRune } from "./BlockRune.ts"
import { ConnectionRune } from "./ConnectionRune.ts"
import { ExtrinsicRune } from "./ExtrinsicRune.ts"
import { PalletRune } from "./PalletRune.ts"

export interface Chain<M extends FrameMetadata = FrameMetadata> {
  connection: Connection
  metadata: M
}

export namespace Chain {
  export type Req<C extends Chain, Rest extends Chain> = U2I<Rest> & { _chain?: C }

  type ExtrinsicFieldNative<C extends Chain, K extends keyof Chain["metadata"]["extrinsic"]> =
    $.Native<C["metadata"]["extrinsic"][K]>
  export type Call<C extends Chain> = ExtrinsicFieldNative<C, "call">
  export type Address<C extends Chain> = ExtrinsicFieldNative<C, "address">
  export type Signature<C extends Chain> = ExtrinsicFieldNative<C, "signature">
  export type Extra<C extends Chain> = ExtrinsicFieldNative<C, "extra">
  export type Additional<C extends Chain> = ExtrinsicFieldNative<C, "additional">

  export type Pallets<C extends Chain> = C["metadata"]["pallets"]
  export type PalletName<C extends Chain> = Extract<keyof Pallets<C>, string>
  export type Pallet<C extends Chain, P extends PalletName<C>> = Pallets<C>[P]

  export type Constants<C extends Chain, P extends PalletName<C>> = Pallet<C, P>["constants"]
  export type ConstantName<
    C extends Chain,
    P extends PalletName<C>,
  > = Extract<keyof Constants<C, P>, string>
  export type Constant<C extends Chain, P extends PalletName<C>, K extends ConstantName<C, P>> =
    Constants<C, P>[K]

  export namespace Constant {
    export type Value<C extends Chain, P extends PalletName<C>, K extends ConstantName<C, P>> =
      $.Native<Constant<C, P, K>["codec"]>
  }

  export type StorageEntries<C extends Chain, P extends PalletName<C>> = Pallet<C, P>["storage"]
  export type StorageName<
    C extends Chain,
    P extends PalletName<C>,
  > = Extract<keyof StorageEntries<C, P>, string>
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
    return this.connection
      .call("chain_getBlock", blockHash)
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
}
