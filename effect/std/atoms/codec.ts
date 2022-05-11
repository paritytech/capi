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
  return native([deriveCodec, typeI], (deriveCodec, typeI) => {
    return () => {
      // TODO
      // @ts-ignore
      return deriveCodec(typeI);
    };
  });
};
