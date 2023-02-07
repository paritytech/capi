import * as $ from "../deps/scale.ts"
import * as M from "../frame_metadata/mod.ts"
import * as rpc from "../rpc/mod.ts"
import { Rune, RunicArgs } from "../rune/mod.ts"
import { HexHash } from "../util/mod.ts"
import { BlockRune } from "./BlockRune.ts"
import { RuntimeEvent } from "./EventsRune.ts"
import { ExtrinsicRune } from "./ExtrinsicRune.ts"
import { MetadataRune } from "./MetadataRune.ts"
import { chain, state } from "./rpc_method_runes.ts"
import { rpcCall } from "./rpc_runes.ts"

export interface Chain<Call = unknown, Event extends RuntimeEvent = RuntimeEvent> {
  call: Call
  event: Event
}

export class ClientRune<out U, out C extends Chain = Chain> extends Rune<rpc.Client, U> {
  block<X>(...[_maybeHash]: RunicArgs<X, [blockHash?: HexHash]>) {
    const maybeHash = Rune.resolve(_maybeHash)
    const blockHash = maybeHash
      .unhandle(undefined)
      .rehandle(undefined, () => chain.getFinalizedHead(this.as(Rune)))
    return chain
      .getBlock(this.as(Rune), blockHash)
      .into(BlockRune, this, blockHash)
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
    return call.into(ExtrinsicRune, this.as(ClientRune))
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
