import * as $ from "../deps/scale.ts"
import * as M from "../frame_metadata/mod.ts"
import * as rpc from "../rpc/mod.ts"
import { Rune, RunicArgs } from "../rune/mod.ts"
import { HexHash } from "../util/mod.ts"
import { BlockRune } from "./BlockRune.ts"
import { RuntimeEventBase } from "./EventsRune.ts"
import { ExtrinsicRune } from "./ExtrinsicRune.ts"
import { FinalizedBlockRune } from "./FinalizedBlockRune.ts"
import { MetadataRune } from "./MetadataRune.ts"
import { chain, state } from "./rpc_method_runes.ts"
import { rpcCall } from "./rpc_runes.ts"

export interface Chain {
  call: unknown
  runtimeEvent: RuntimeEventBase
}

export class ClientRune<out U, out C extends Chain = Chain> extends Rune<rpc.Client, U> {
  block<X>(...args: RunicArgs<X, [blockHash?: HexHash]>) {
    const [blockHash] = RunicArgs.resolve(args)
    return chain
      .getBlock(this.into(), blockHash)
      .into(BlockRune, this, blockHash)
  }

  finalizedBlock<X>(...args: RunicArgs<X, [blockHash?: HexHash]>) {
    const [blockHash] = RunicArgs.resolve(args)
    const head = chain.getFinalizedHead(this.into())
    return chain
      .getBlock(this.into(), head)
      .into(FinalizedBlockRune, this, blockHash)
  }

  metadata<X>(...[blockHash]: RunicArgs<X, [blockHash?: HexHash]>) {
    return state
      .getMetadata(this.into(), blockHash)
      .map(M.fromPrefixedHex)
      .throws($.ScaleError)
      .into(MetadataRune, this)
  }

  extrinsic<X>(...args: RunicArgs<X, [call: C["call"]]>) {
    const [call] = RunicArgs.resolve(args)
    return call.into(ExtrinsicRune<RunicArgs.U<X> | U, C>, this)
  }

  chainVersion = rpcCall<[], string>("system_version")(this.into())

  private _asCodegen<C extends Chain>() {
    return this as any as ClientRune<U, C>
  }
}
