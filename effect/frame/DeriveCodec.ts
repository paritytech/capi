import { AnyResolvable, Effect } from "/effect/Base.ts";
import * as m from "/frame_metadata/mod.ts";
import { Metadata, metadata } from "./Metadata.ts";

export class DeriveCodecError extends Error {}

export class DeriveCodec<Beacon extends AnyResolvable>
  extends Effect<{}, DeriveCodecError, m.DeriveCodec, [Metadata<Beacon>]>
{
  constructor(readonly beacon: Beacon) {
    super([metadata(beacon)], async (_, metadataResolved) => {
      return m.DeriveCodec(metadataResolved);
    });
  }
}

export const deriveCodec = <Beacon extends AnyResolvable>(beacon: Beacon): DeriveCodec<Beacon> => {
  return new DeriveCodec(beacon);
};
