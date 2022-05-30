import { decodeSs58Text } from "/crypto/mod.ts";
import { effector } from "/effect/Effect.ts";
import * as hex from "std/encoding/hex.ts";

export const pubKeyFromSs58 = effector.sync("pubKeyFromSs58", () =>
  (init: string) => {
    // TODO: decode byte representation instead
    return hex.decode(decodeSs58Text(init));
  });
