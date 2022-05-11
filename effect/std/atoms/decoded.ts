import { MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import * as m from "/frame_metadata/mod.ts";
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
  return native([codec, encoded], (codec, encoded) => {
    return async () => {
      // TODO
      // @ts-ignore
      return codec.decode(encoded);
    };
  });
};
