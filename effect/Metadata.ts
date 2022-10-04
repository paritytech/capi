import * as Z from "../deps/zones.ts";
import * as M from "../frame_metadata/mod.ts";
import * as known from "../known/mod.ts";
import * as U from "../util/mod.ts";
import { runtime } from "./core/runtime.ts";
import { RpcCall } from "./RpcCall.ts";

type ConfigConstraint = known.rpc.Config<string, "state_getMetadata">;

export class Metadata<Rest extends [blockHash?: Z.$<U.HashHexString | undefined>]> extends Z.Name {
  root;

  constructor(config: ConfigConstraint, ...[blockHash]: Rest) {
    super();
    this.root = Z.atom(
      [new RpcCall(config, "state_getMetadata", [blockHash])],
      (call) => {
        try {
          return M.fromPrefixedHex(call.result);
        } catch (e) {
          return new MetadataDecodeError(e);
        }
      },
    );
  }

  run = runtime(this);
}

export const palletMetadata = Z.atomf(M.getPallet);

export const entryMetadata = Z.atomf(M.getEntry);

export class MetadataDecodeError extends U.ErrorCtor("MetadataDecode") {
  // TODO: replace with internal scale error & ensure appropriate trace info
  constructor(readonly scaleError: unknown) {
    super();
  }
}
