import { getBindings } from "../../../bindings/mod.ts";
import { effector } from "../../impl/mod.ts";
import * as hex from "../../../util/hex.ts";

export const pubKeyFromSs58 = effector.async("pubKeyFromSs58", () =>
  async (init: string) => {
    // TODO: decode byte representation instead
    return hex.decodeBuf((await getBindings()).decodeSs58Text(init));
  });
