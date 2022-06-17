import { Ss58 } from "../../../bindings/mod.ts";
import * as hex from "../../../util/hex.ts";
import { effector } from "../../impl/mod.ts";

export const pubKeyFromSs58 = effector.async("pubKeyFromSs58", () =>
  async (init: string) => {
    // TODO: decode byte representation instead
    const decoded = (await Ss58()).decode(init);
    if (decoded instanceof Error) {
      return decoded;
    }
    return hex.decode(decoded[1]);
  });
