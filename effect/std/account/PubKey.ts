import { instantiate } from "../../../bindings/ss58/mod.generated.js";
import * as hex from "../../../util/hex.ts";
import { effector } from "../../impl/mod.ts";

export const pubKeyFromSs58 = effector.async("pubKeyFromSs58", () =>
  async (init: string) => {
    // TODO: decode byte representation instead
    return hex.decodeBuf((await instantiate()).decodeSs58Text(init));
  });
