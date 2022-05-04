import { AnyEffect, AnyEffectA, Effect } from "/effect/Base.ts";
import { MetadataLookup, metadataLookup } from "/effect/frame/MetadataLookup.ts";
import * as m from "/frame_metadata/mod.ts";

export class PalletError extends Error {}

export class Pallet<
  Beacon extends AnyEffect,
  Name extends AnyEffectA<string>,
> extends Effect<{}, PalletError, m.Pallet, [MetadataLookup<Beacon>, Name]> {
  constructor(
    beacon: Beacon,
    name: Name,
  ) {
    super([metadataLookup(beacon), name], async (_, metadataLookup, name) => {
      return metadataLookup.getPalletByName(name);
    });
  }
}

export const pallet = <
  Beacon extends AnyEffect,
  Name extends AnyEffectA<string>,
>(
  beacon: Beacon,
  name: Name,
): Pallet<Beacon, Name> => {
  return new Pallet(beacon, name);
};
