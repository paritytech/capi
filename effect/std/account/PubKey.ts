import { decodeSs58Text } from "/bindings/mod.ts";
import { effector } from "/effect/Effect.ts";
import * as hex from "/util/hex.ts";

export const pubKeyFromSs58 = effector.sync("pubKeyFromSs58", () =>
  (init: string) => {
    // TODO: decode byte representation instead
    return hex.decodeBuf(decodeSs58Text(init));
  });
