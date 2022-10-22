import * as Z from "../deps/zones.ts";
import * as M from "../frame_metadata/mod.ts";
import { Config } from "../mod.ts";
import * as U from "../util/mod.ts";
import { RpcCall } from "./RpcCall.ts";

export class Metadata<Rest extends [blockHash?: Z.$<U.HexHash | undefined>]> extends Z.Name {
  root;

  constructor(config: Config, ...[blockHash]: [...Rest]) {
    super();
    this.root = Z.call(
      new RpcCall(config, "state_getMetadata", [blockHash]),
      function metadataImpl(call) {
        try {
          return M.fromPrefixedHex(call.result);
        } catch (e) {
          return new MetadataDecodeError(e);
        }
      },
    );
  }
}

export const palletMetadata = Z.call.fac(M.getPallet);
export const entryMetadata = Z.call.fac(M.getEntry);

export class MetadataDecodeError extends U.ErrorCtor("MetadataDecode") {
  // TODO: replace with internal scale error & ensure appropriate trace info
  constructor(readonly scaleError: unknown) {
    super();
  }
}
