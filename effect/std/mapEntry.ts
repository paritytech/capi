import { effector } from "../impl/mod.ts";
import { Entry } from "./entry.ts";
import { Map } from "./map.ts";

export const mapEntry = effector.sync(
  "map",
  () =>
    (map: Map, key: unknown): Entry => {
      return {
        pallet: map.pallet,
        name: map.name,
        key,
      };
    },
);
