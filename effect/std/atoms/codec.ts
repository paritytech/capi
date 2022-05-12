import { MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import * as m from "/frame_metadata/mod.ts";

export const codec = <
  DeriveCodec extends MaybeEffectLike<m.DeriveCodec>,
  TypeI extends MaybeEffectLike<number>,
>(
  deriveCodec: DeriveCodec,
  typeI: TypeI,
) => {
  const args: [DeriveCodec, TypeI] = [deriveCodec, typeI];
  return native(args, (deriveCodec, typeI) => {
    return async () => {
      return deriveCodec(typeI);
    };
  });
};
