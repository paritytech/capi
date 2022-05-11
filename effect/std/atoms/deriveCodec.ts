import { MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import * as m from "/frame_metadata/mod.ts";

// TODO: move into & get from `frame_metadata`
export class DeriveCodecError extends Error {}

export const deriveCodec = <Metadata extends MaybeEffectLike<m.Metadata>>(metadata: Metadata) => {
  return native([metadata], (metadata) => {
    return async () => {
      return m.DeriveCodec(metadata);
    };
  });
};
