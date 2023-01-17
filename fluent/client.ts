import * as $ from "../deps/scale.ts"
import * as M from "../frame_metadata/mod.ts"
import * as rpc from "../rpc/mod.ts"
import { Args, ArgsU, resolveArgs, Rune } from "../rune/mod.ts"
import { HexHash } from "../util/mod.ts"
import { ExtrinsicRune } from "./extrinsic.ts"
import { MetadataRune } from "./metadata.ts"
import { rpcCall } from "./rpc.ts"
import { state } from "./rpc_known_methods.ts"

export class ClientRune<out U, out Call = unknown> extends Rune<rpc.Client, U> {
  metadata<X>(...[blockHash]: Args<X, [blockHash?: HexHash]>) {
    return state
      .getMetadata(this.as(), blockHash)
      .unwrapError()
      .pipe((encoded) => {
        try {
          return M.fromPrefixedHex(encoded)
        } catch (e) {
          return e as $.ScaleError
        }
      })
      .unwrapError()
      .subclass(MetadataRune, this)
  }

  extrinsic<X>(...args: Args<X, [call: Call]>) {
    const [call] = resolveArgs(args)
    return call.subclass(ExtrinsicRune<Call, ArgsU<X> | U>, this)
  }

  chainVersion = rpcCall<[], string>("system_version")(this.as()).unwrapError()

  private _asCodegen<Call>() {
    return this as any as ClientRune<U, Call>
  }
}
