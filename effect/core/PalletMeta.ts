import { AnyResolvable, AnyResolvableA, Effect } from "/effect/Base.ts";
import { MetadataLookup } from "/effect/core/MetadataLookup.ts";
import * as m from "/frame_metadata/mod.ts";

export class PalletError extends Error {}

export class PalletMeta<
  Beacon extends AnyResolvable,
  Name extends AnyResolvableA<string>,
> extends Effect<{}, PalletError, m.Pallet, [MetadataLookup<Beacon>, Name]> {
  constructor(
    readonly beacon: Beacon,
    readonly name: Name,
  ) {
    super([new MetadataLookup(beacon), name], async (_, metadataLookup, name) => {
      return metadataLookup.getPalletByName(name);
    });
  }
}
