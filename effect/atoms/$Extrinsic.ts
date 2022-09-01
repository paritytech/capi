import * as M from "../../frame_metadata/mod.ts";
import { atomFactory } from "../sys/Atom.ts";

export const $extrinsic = atomFactory("ExtrinsicCodec", (
  deriveCodec: M.DeriveCodec,
  metadata: M.Metadata,
  sign?: M.SignExtrinsic,
) => {
  return M.$extrinsic({
    deriveCodec,
    metadata,
    sign: sign!,
  });
});
