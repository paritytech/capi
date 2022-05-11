import { Effect, MaybeEffect } from "/effect/Base.ts";

export class Pallet<
  Beacon,
  PalletName extends MaybeEffect<string>,
> extends Effect<[], void, never, {}> {
  constructor(
    readonly beacon: Beacon,
    readonly palletName: PalletName,
  ) {
    super([], () => {
      return async () => {};
    });
  }
}
