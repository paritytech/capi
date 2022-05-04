import { AnyEffect, Effect } from "/effect/Base.ts";
import * as m from "/frame_metadata/mod.ts";
import { Metadata, metadata } from "./Metadata.ts";

export class MetadataLookupError extends Error {}

export class MetadataLookup<Beacon extends AnyEffect>
  extends Effect<{}, MetadataLookupError, m.Lookup, [Metadata<Beacon>]>
{
  constructor(beacon: Beacon) {
    super([metadata(beacon)], async (_, metadataResolved) => {
      return new m.Lookup(metadataResolved);
    });
  }
}

export const metadataLookup = <Beacon extends AnyEffect>(beacon: Beacon): MetadataLookup<Beacon> => {
  return new MetadataLookup(beacon);
};
