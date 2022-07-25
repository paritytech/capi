import * as M from "../../frame_metadata/mod.ts";
import { atomFactory } from "../sys/Atom.ts";

export const deriveCodec = atomFactory("DeriveCodec", (metadata: M.Metadata) => {
  return M.DeriveCodec(metadata.tys);
});
