import { effector } from "/effect/impl/mod.ts";

export const ss58FromText = effector.sync("ss58FromText", () =>
  (init: string) => {
    // TODO: return byte representation instead
    return init;
  });
