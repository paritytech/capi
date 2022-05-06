import { AnyResolvable, Effect } from "/effect/Base.ts";
import * as m from "/frame_metadata/mod.ts";
import { Metadata } from "./Metadata.ts";

export class MetadataLookupError extends Error {}

export class MetadataLookup<Beacon extends AnyResolvable>
  extends Effect<{}, MetadataLookupError, m.Lookup, [Metadata<Beacon>]>
{
  constructor(readonly beacon: Beacon) {
    super([new Metadata(beacon)], async (_, metadataResolved) => {
      return new m.Lookup(metadataResolved);
    });
  }
}
