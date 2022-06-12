import { Pallet } from "../../effect/std/pallet.ts";
import { effector } from "../impl/mod.ts";

export interface Entry {
  pallet: Pallet;
  name: string;
  key?: unknown;
}

export const entry = effector.sync(
  "entry",
  () =>
    (pallet: Pallet, name: string, key?: unknown): Entry => ({
      pallet,
      name,
      key,
    }),
);
