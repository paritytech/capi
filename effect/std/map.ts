import { effector } from "../impl/mod.ts";
import { Pallet } from "./pallet.ts";

export interface Map {
  pallet: Pallet;
  name: string;
}

export const map = effector.sync("map", () =>
  (pallet: Pallet, name: string): Map => ({
    pallet,
    name,
  }));
