import { Effect } from "/effect/Base.ts";
import { Metadata } from "/effect/core/Metadata.ts";
import * as m from "/frame_metadata/mod.ts";

// TODO: move into and get from `frame_metadata`
export class MetadataLookupError extends Error {}

export class MetadataLookup<Beacon> extends Effect<[Beacon, Metadata<Beacon>], m.Lookup, MetadataLookupError, {}> {
  constructor(readonly beacon: Beacon) {
    super([beacon, new Metadata(beacon)], (_, metadata) => {
      return async () => {
        return new m.Lookup(metadata);
      };
    });
  }
}
