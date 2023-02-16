import * as $ from "../deps/scale.ts"
import * as M from "../frame_metadata/mod.ts"
import { Event } from "../primitives/mod.ts"
import { RpcClient } from "../rpc/mod.ts"
import { MetaRune, Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { HexHash } from "../util/mod.ts"
import { BlockRune } from "./BlockRune.ts"
import { ExtrinsicRune } from "./ExtrinsicRune.ts"
import { MetadataRune } from "./MetadataRune.ts"
import { chain, state } from "./rpc_method_runes.ts"
import { rpcCall } from "./rpc_runes.ts"

export interface Chain<C = unknown, E extends Event = Event> {
  call: C
  event: E
}

// TODO: do we want to represent the discovery value and conn type within the type system?
export class ClientRune<out U, out C extends Chain = Chain> extends Rune<RpcClient<any>, U> {
  latestBlock = this.block(chain.getBlockHash(
    this,
    chain
      .subscribeNewHeads(this.as(ClientRune))
      .map((header) => Rune.constant(header))
      .into(MetaRune)
      .flatMap((headers) => headers.into(ValueRune))
      .access("number"),
  ))

  block<X>(...[blockHash]: RunicArgs<X, [blockHash: HexHash]>) {
    return chain
      .getBlock(this.as(Rune), blockHash)
      .into(BlockRune, this, Rune.resolve(blockHash))
  }

  metadata<X>(...[blockHash]: RunicArgs<X, [blockHash?: HexHash]>) {
    return state
      .getMetadata(this.as(Rune), blockHash)
      .map(M.fromPrefixedHex)
      .throws($.ScaleError)
      .into(MetadataRune, this)
  }

  extrinsic<X>(...args: RunicArgs<X, [call: C["call"]]>) {
    const [call] = RunicArgs.resolve(args)
    return call.into(ExtrinsicRune, this.as(ClientRune<U, C>))
  }

  addressPrefix() {
    return this
      .metadata()
      .pallet("System")
      .const("SS58Prefix")
      .decoded
      .unsafeAs<number>()
  }

  chainVersion = rpcCall<[], string>("system_version")(this.as(Rune))

  private _asCodegen<C extends Chain>() {
    return this as any as ClientRune<U, C>
  }
}
