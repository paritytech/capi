import { MaybeEffectLike } from "../../../effect/Effect.ts";
import { step } from "../../../effect/intrinsic/Step.ts";
import * as m from "../../../frame_metadata/mod.ts";

// TODO: move into & get from `frame_metadata`
export class MetadataLookupError extends Error {}

export const metadataLookup = <Metadata extends MaybeEffectLike<m.Metadata>>(metadata: Metadata) => {
  return step("MetadataLookup", [metadata], (metadata) => {
    return async () => {
      return new m.Lookup(metadata);
    };
  });
};
