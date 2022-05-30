import { MaybeEffectLike } from "../../../effect/Effect.ts";
import { step } from "../../../effect/intrinsic/Step.ts";
import * as m from "../../../frame_metadata/mod.ts";

export const codec = <
  DeriveCodec extends MaybeEffectLike<m.DeriveCodec>,
  TypeI extends MaybeEffectLike<number>,
>(
  deriveCodec: DeriveCodec,
  typeI: TypeI,
) => {
  return step("Codec", [deriveCodec, typeI], (deriveCodec, typeI) => {
    return async () => {
      return deriveCodec(typeI);
    };
  });
};
