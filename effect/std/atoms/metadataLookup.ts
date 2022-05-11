import { MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import * as m from "/frame_metadata/mod.ts";

// TODO: move into & get from `frame_metadata`
export class MetadataLookupError extends Error {}

export const metadataLookup = <Metadata extends MaybeEffectLike<m.Metadata>>(metadata: Metadata) => {
  return native([metadata], (metadata) => {
    return async () => {
      return new m.Lookup(metadata);
    };
  });
};
