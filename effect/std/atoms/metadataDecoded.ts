import { MaybeEffectLike } from "../../../effect/Effect.ts";
import { step } from "../../../effect/intrinsic/Step.ts";
import * as m from "../../../frame_metadata/mod.ts";

// TODO: move into `frame_metadata`
export class MetadataDecodeError extends Error {}

export const metadataDecoded = <Encoded extends MaybeEffectLike<string>>(encoded: Encoded) => {
  return step("MetadataDecoded", [encoded], (encoded) => {
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
