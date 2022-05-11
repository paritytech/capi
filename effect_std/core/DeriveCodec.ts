import { Effect } from "/effect/Base.ts";
import * as m from "/frame_metadata/mod.ts";
import { Metadata } from "./Metadata.ts";

// TODO: move into & get from `frame_metadata`
export class DeriveCodecError extends Error {}

export class DeriveCodec<Beacon> extends Effect<[Beacon, Metadata<Beacon>], m.DeriveCodec, never, {}> {
  constructor(readonly beacon: Beacon) {
    super([beacon, new Metadata(beacon)], (_, metadata) => {
      return async () => {
        return m.DeriveCodec(metadata);
      };
    });
  }
}
