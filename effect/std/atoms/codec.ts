import { effector } from "/effect/Effect.ts";
import * as m from "/frame_metadata/mod.ts";

export const codec = effector.sync("codec", () =>
  (deriveCodec: m.DeriveCodec, typeI: number) => {
    return deriveCodec(typeI);
  });
