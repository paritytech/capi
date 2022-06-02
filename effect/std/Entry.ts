import { effector } from "/effect/Effect.ts";
import { Pallet } from "/effect/std/pallet.ts";

export interface Entry {
  pallet: Pallet;
  name: string;
  keys: [a?: unknown, b?: unknown];
}

export const entry = effector.sync(
  "entry",
  () =>
    (pallet: Pallet, name: string, ...keys: [a?: unknown, b?: unknown]): Entry => ({
      pallet,
      name,
      keys,
    }),
);
