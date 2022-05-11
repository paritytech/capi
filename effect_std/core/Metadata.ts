import { Effect } from "/effect/Base.ts";
import { RpcCall } from "/effect/rpc/Call.ts";
import * as m from "/frame_metadata/mod.ts";

// TODO: move into `frame_metadata`
export class MetadataDecodeError extends Error {}

export class Metadata<Beacon>
  extends Effect<[Beacon, RpcCall<Beacon, "state_getMetadata", []>], m.Metadata, MetadataDecodeError, {}>
{
  constructor(readonly beacon: Beacon) {
    super([beacon, new RpcCall(beacon, "state_getMetadata")], (_, rpcCall) => {
      return async () => {
        try {
          return m.fromPrefixedHex(rpcCall.result);
        } catch (e) {
          console.error(e);
          return new MetadataDecodeError();
        }
      };
    });
  }
}
