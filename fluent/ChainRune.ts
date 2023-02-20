import * as $ from "../deps/scale.ts"
import * as M from "../frame_metadata/mod.ts"
import { Event } from "../primitives/mod.ts"
import { Connection } from "../rpc/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { HexHash } from "../util/mod.ts"
import { BlockRune } from "./BlockRune.ts"
import { ConnectionRune } from "./ConnectionRune.ts"
import { ExtrinsicRune } from "./ExtrinsicRune.ts"
import { MetadataRune } from "./MetadataRune.ts"

export interface Chain<C = unknown, E extends Event = Event> {
  connection: Connection
  _call?: $.Codec<C>
  _event?: $.Codec<E>
}

export namespace Chain {
  export type Call<C extends Chain> = C extends Chain<infer Call, any> ? Call : never
  export type Event<C extends Chain> = C extends Chain<any, infer Event> ? Event : never
}

// TODO: do we want to represent the discovery value and conn type within the type system?
export class ChainRune<out U, out C extends Chain = Chain> extends Rune<C, U> {
  connection = this.into(ValueRune<Chain, U>).access("connection").into(ConnectionRune)

  latestBlock = this.block(
    this.connection
      .call(
        "chain_getBlockHash",
        this.connection
          .subscribe("chain_subscribeNewHeads", "chain_unsubscribeNewHeads")
          .access("number"),
      )
      .unsafeAs<HexHash>(),
  )

  block<X>(...[blockHash]: RunicArgs<X, [blockHash: HexHash]>) {
    return this.connection.call("chain_getBlock", blockHash)
      .unhandle(null)
      .into(BlockRune, this, Rune.resolve(blockHash))
  }

  metadata<X>(...[blockHash]: RunicArgs<X, [blockHash?: HexHash]>) {
    return this.connection.call("state_getMetadata", blockHash)
      .map(M.fromPrefixedHex)
      .throws($.ScaleError)
      .into(MetadataRune, this)
  }

  extrinsic<X>(...args: RunicArgs<X, [call: Chain.Call<C>]>) {
    const [call] = RunicArgs.resolve(args)
    return call.into(ExtrinsicRune, this.as(ChainRune))
  }

  addressPrefix() {
    return this
      .metadata()
      .pallet("System")
      .const("SS58Prefix")
      .decoded
      .unsafeAs<number>()
  }

  chainVersion = this.connection.call("system_version")

  private _asCodegen<C extends Chain>() {
    return this as any as ChainRune<U, C>
  }
}
