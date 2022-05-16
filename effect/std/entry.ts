import { MaybeEffectLike } from "/effect/Effect.ts";
import { AnyPallet } from "/effect/std/Pallet.ts";
import { Read, read } from "/effect/std/Read.ts";

export class Entry<
  Pallet extends AnyPallet,
  Name extends MaybeEffectLike<string>,
  Keys extends [
    a?: unknown,
    b?: unknown,
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
  [
    a?: unknown,
    b?: unknown,
  ]
>;

export const entry = <
  Pallet extends AnyPallet,
  Name extends MaybeEffectLike<string>,
  Keys extends [
    a?: unknown,
    b?: unknown,
  ],
>(
  pallet: Pallet,
  name: Name,
  ...keys: Keys
): Entry<Pallet, Name, Keys> => {
  return new Entry(pallet, name, ...keys);
};
