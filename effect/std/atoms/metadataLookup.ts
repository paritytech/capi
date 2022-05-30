import { effector } from "/effect/Effect.ts";
import * as m from "/frame_metadata/mod.ts";

// TODO: MetadataLookupError from `frame_metadata`?

export const metadataLookup = effector.sync("metadataLookup", () =>
  (metadata: m.Metadata) => {
    return new m.Lookup(metadata);
  });
