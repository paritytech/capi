import { AnyResolvable, AnyResolvableA, Effect } from "/effect/Base.ts";
import { MetadataLookup, metadataLookup } from "/effect/frame/MetadataLookup.ts";
import * as m from "/frame_metadata/mod.ts";

export class PalletError extends Error {}

export class Pallet<
  Beacon extends AnyResolvable,
  Name extends AnyResolvableA<string>,
> extends Effect<{}, PalletError, m.Pallet, [MetadataLookup<Beacon>, Name]> {
  constructor(
    readonly beacon: Beacon,
    readonly name: Name,
  ) {
    super([metadataLookup(beacon), name], async (_, metadataLookup, name) => {
      return metadataLookup.getPalletByName(name);
    });
  }
}

export const pallet = <
  Beacon extends AnyResolvable,
  Name extends AnyResolvableA<string>,
>(
  beacon: Beacon,
  name: Name,
): Pallet<Beacon, Name> => {
  return new Pallet(beacon, name);
};
