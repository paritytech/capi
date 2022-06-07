import { effector } from "/effect/Effect.ts";
import { Entry } from "/effect/std/entry.ts";
import { Map } from "/effect/std/map.ts";

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
