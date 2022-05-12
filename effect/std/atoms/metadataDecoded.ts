import { MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import * as m from "/frame_metadata/mod.ts";

// TODO: move into `frame_metadata`
export class MetadataDecodeError extends Error {}

export const metadataDecoded = <Encoded extends MaybeEffectLike<string>>(encoded: Encoded) => {
  return native([encoded], (encoded) => {
    return async () => {
      try {
        return m.fromPrefixedHex(encoded);
      } catch (e) {
        console.error(e);
        return new MetadataDecodeError();
      }
    };
  });
};
