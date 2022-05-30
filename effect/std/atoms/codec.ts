import { effector } from "/effect/Effect.ts";
import * as M from "/frame_metadata/mod.ts";

export const codec = effector.sync("codec", () =>
  (deriveCodec: M.DeriveCodec, typeI: number) => {
    return deriveCodec(typeI);
  });
