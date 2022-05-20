import { MaybeEffectLike } from "/effect/Effect.ts";
import { step } from "/effect/intrinsic/Step.ts";
import { hexToU8a } from "/util/hex.ts";
import * as S from "x/scale/mod.ts";

// TODO: move into & get from `frame_metadata`
export class DecodedError extends Error {}

export const decoded = <
  Codec extends MaybeEffectLike<S.Codec<unknown>>,
  Encoded extends MaybeEffectLike<string>,
>(
  codec: Codec,
  encoded: Encoded,
) => {
  return step("Decoded", [codec, encoded], (codec, encoded) => {
    return async () => {
      return codec.decode(hexToU8a(encoded));
    };
  });
};
