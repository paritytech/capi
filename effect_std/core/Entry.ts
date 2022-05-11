import { Effect, MaybeEffect } from "/effect/Base.ts";
import { Pallet } from "/effect/core/Pallet.ts";

export class Entry<
  Pallet_ extends Pallet<any, MaybeEffect<string>>,
  EntryName extends MaybeEffect<string>,
> extends Effect<[], void, never, {}> {
  constructor(
    readonly pallet: Pallet_,
    readonly entryName: EntryName,
  ) {
    super([], () => {
      return async () => {};
    });
  }
}

// class Entry2<
//   Beacon,
//   Pallet extends AnyResolvableA<PalletResolved<Beacon>>,
//   EntryName extends AnyResolvableA<string>,
// > extends E<{}, never, EntryResolved<Beacon>>() {
//   constructor(
//     pallet: Pallet,
//     entryName: EntryName,
//   ) {
//     super([pallet, entryName], async () => {});
//   }
// }
