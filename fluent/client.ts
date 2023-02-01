import * as $ from "../deps/scale.ts"
import * as M from "../frame_metadata/mod.ts"
import * as rpc from "../rpc/mod.ts"
import { Rune, RunicArgs } from "../rune/mod.ts"
import { HexHash } from "../util/mod.ts"
import { ExtrinsicRune } from "./extrinsic.ts"
import { MetadataRune } from "./metadata.ts"
import { rpcCall } from "./rpc.ts"
import { state } from "./rpc_known_methods.ts"

export interface Chain {
  call: unknown
  event: unknown
}

export class ClientRune<out U, out C extends Chain = Chain> extends Rune<rpc.Client, U> {
  metadata<X>(...[blockHash]: RunicArgs<X, [blockHash?: HexHash]>) {
    return state
      .getMetadata(this.as(), blockHash)
      .unwrapError()
      .map((encoded) => {
        try {
          return M.fromPrefixedHex(encoded)
        } catch (e) {
          return e as $.ScaleError
        }
      })
      .unwrapError()
      .as(MetadataRune, this)
  }

  extrinsic<X>(...args: RunicArgs<X, [call: C["call"]]>) {
    const [call] = RunicArgs.resolve(args)
    return call.as(ExtrinsicRune<RunicArgs.U<X> | U, C>, this)
  }

  chainVersion = rpcCall<[], string>("system_version")(this.as()).unwrapError()

  private _asCodegen<C extends Chain>() {
    return this as any as ClientRune<U, C>
  }
}
