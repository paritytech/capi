import * as M from "../../../frame_metadata/mod.ts";
import { ErrorCtor } from "../../../util/mod.ts";
import { effector } from "../../impl/mod.ts";

// TODO: move into & get from `frame_metadata`
export class DeriveCodecError extends ErrorCtor("DeriveCodecError") {}

export const deriveCodec = effector.sync("deriveCodec", () =>
  (metadata: M.Metadata) => {
    return M.DeriveCodec(metadata);
  });
