import * as Z from "../../deps/zones.ts";
import * as M from "../../frame_metadata/mod.ts";

export const deriveCodec = Z.atomf((metadata: M.Metadata) => {
  return M.DeriveCodec(metadata.tys);
});
