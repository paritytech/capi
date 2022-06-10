import { effector } from "../impl/mod.ts";
import { Entry } from "./entry.ts";
import { Map } from "./map.ts";

export const mapEntry = effector.sync(
  "map",
  () =>
    (map: Map, keyA: unknown, keyB?: unknown): Entry => {
      return {
        pallet: map.pallet,
        name: map.name,
        keys: [keyA, keyB],
      };
    },
);
