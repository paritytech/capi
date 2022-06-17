import * as M from "../../../frame_metadata/mod.ts";
import { ErrorCtor } from "../../../util/mod.ts";
import { effector } from "../../impl/mod.ts";

// TODO: move into `frame_metadata`
export class MetadataDecodeError extends ErrorCtor("MetadataDecodeError") {}

export const metadataDecoded = effector.sync("metadataDecoded", () =>
  (encoded: string) => {
    try {
      return M.fromPrefixedHex(encoded);
    } catch (_e) {
      return new MetadataDecodeError();
    }
  });
