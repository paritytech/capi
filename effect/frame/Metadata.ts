import { AnyResolvable, Effect } from "/effect/Base.ts";
import { RpcCall, rpcCall } from "/effect/rpc/Call.ts";
import * as m from "/frame_metadata/mod.ts";

// TODO: move into `frame_metadata`
export class MetadataDecodeError extends Error {}

export class Metadata<Beacon extends AnyResolvable>
  extends Effect<{}, MetadataDecodeError, m.Metadata, [RpcCall<Beacon, "state_getMetadata", []>]>
{
  constructor(readonly beacon: Beacon) {
    super([rpcCall(beacon, "state_getMetadata")], async (_, metadata) => {
      return m.fromPrefixedHex(metadata.result);
    });
  }
}

export const metadata = <Beacon extends AnyResolvable>(beacon: Beacon): Metadata<Beacon> => {
  return new Metadata(beacon);
};
