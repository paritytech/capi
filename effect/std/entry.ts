import { MaybeEffectLike } from "/effect/Base.ts";
import { AnyPallet } from "/effect/std/pallet.ts";
import { Read, read } from "/effect/std/read.ts";

export class Entry<
  Pallet extends AnyPallet,
  Name extends MaybeEffectLike<string>,
  Keys extends [
    a?: MaybeEffectLike<string>,
    b?: MaybeEffectLike<string>,
  ],
> {
  keys;

  constructor(
    readonly pallet: Pallet,
    readonly name: Name,
    ...keys: Keys
  ) {
    this.keys = keys;
  }

  read(): Read<this> {
    return read(this);
  }
}

export type AnyEntry = Entry<
  AnyPallet,
  MaybeEffectLike<string>,
  [a?: MaybeEffectLike<string>, b?: MaybeEffectLike<string>]
>;

export const entry = <
  Pallet extends AnyPallet,
  Name extends MaybeEffectLike<string>,
  Keys extends [
    a?: MaybeEffectLike<string>,
    b?: MaybeEffectLike<string>,
  ],
>(
  pallet: Pallet,
  name: Name,
  ...keys: Keys
): Entry<Pallet, Name, Keys> => {
  return new Entry(pallet, name, ...keys);
};
