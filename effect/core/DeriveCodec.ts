import { AnyResolvable, Effect } from "/effect/Base.ts";
import * as m from "/frame_metadata/mod.ts";
import { Metadata } from "./Metadata.ts";

export class DeriveCodecError extends Error {}

export class DeriveCodec<Beacon extends AnyResolvable>
  extends Effect<{}, DeriveCodecError, m.DeriveCodec, [Metadata<Beacon>]>
{
  constructor(readonly beacon: Beacon) {
    super([new Metadata(beacon)], async (_, metadataResolved) => {
      return m.DeriveCodec(metadataResolved);
    });
  }
}
