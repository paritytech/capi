import { MaybeEffectLike } from "/effect/Base.ts";
import { Entry, entry } from "/effect/std/entry.ts";

export class Pallet<
  Beacon,
  Name extends MaybeEffectLike<string>,
> {
  constructor(
    readonly beacon: Beacon,
    readonly name: Name,
  ) {}

  entry<
    EntryName extends MaybeEffectLike<string>,
    Keys extends [
      a?: MaybeEffectLike<string>,
      b?: MaybeEffectLike<string>,
    ],
  >(
    name: EntryName,
    ...keys: Keys
  ): Entry<this, EntryName, Keys> {
    return entry(this, name, ...keys);
  }
}

export type AnyPallet = Pallet<any, MaybeEffectLike<string>>;

export const pallet = <
  Beacon,
  Name extends MaybeEffectLike<string>,
>(
  beacon: Beacon,
  name: Name,
): Pallet<Beacon, Name> => {
  return new Pallet(beacon, name);
};
