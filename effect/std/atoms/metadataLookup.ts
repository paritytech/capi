import { effector } from "../../../effect/impl/mod.ts";
import * as M from "../../../frame_metadata/mod.ts";

// TODO: MetadataLookupError from `frame_metadata`?

export const metadataLookup = effector.sync("metadataLookup", () =>
  (metadata: M.Metadata) => {
    return new M.Lookup(metadata);
  });
