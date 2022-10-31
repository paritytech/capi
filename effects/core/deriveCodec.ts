import * as Z from "../../deps/zones.ts";
import * as M from "../../frame_metadata/mod.ts";

export const deriveCodec = Z.call.fac((metadata: M.Metadata) => {
  return M.DeriveCodec(metadata.tys);
});
