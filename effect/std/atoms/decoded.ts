import { MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
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
  const args: [Codec, Encoded] = [codec, encoded];
  return native(args, (codec, encoded) => {
    return async () => {
      return codec.decode(hexToU8a(encoded));
    };
  });
};
