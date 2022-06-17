import * as M from "../../../frame_metadata/mod.ts";
import { effector } from "../../impl/mod.ts";

export const metadataLookup = effector.sync("metadataLookup", () =>
  (metadata: M.Metadata) => {
    return new M.Lookup(metadata);
  });
