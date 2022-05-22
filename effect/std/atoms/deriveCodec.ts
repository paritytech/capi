import { MaybeEffectLike } from "/effect/Effect.ts";
import { step } from "/effect/intrinsic/Step.ts";
import * as m from "/frame_metadata/mod.ts";

// TODO: move into & get from `frame_metadata`
export class DeriveCodecError extends Error {}

export const deriveCodec = <Metadata extends MaybeEffectLike<m.Metadata>>(metadata: Metadata) => {
  return step("DeriveCodec", [metadata], (metadata) => {
    return async () => {
      return m.DeriveCodec(metadata);
    };
  });
};
