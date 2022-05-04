import { AnyEffect, Effect } from "/effect/Base.ts";
import { RpcCall, rpcCall } from "/effect/rpc/Call.ts";
import { Lift, lift } from "/effect/std/Lift.ts";
import * as m from "/frame_metadata/mod.ts";

// TODO: move into `frame_metadata`
export class MetadataDecodeError extends Error {}

export class Metadata<Beacon extends AnyEffect>
  extends Effect<{}, MetadataDecodeError, m.Metadata, [RpcCall<Beacon, Lift<"state_getMetadata">, []>]>
{
  constructor(readonly beacon: Beacon) {
    const stateGetMetadataCall = rpcCall(beacon, lift("state_getMetadata" as const));
    // TODO: make resolved naming consistent
    super([stateGetMetadataCall], async (_, metadataResolved) => {
      return m.fromPrefixedHex(metadataResolved.result);
    });
  }
}

export const metadata = <Beacon extends AnyEffect>(beacon: Beacon): Metadata<Beacon> => {
  return new Metadata(beacon);
};
