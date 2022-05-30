import { effector } from "/effect/Effect.ts";
import * as M from "/frame_metadata/mod.ts";

// TODO: move into `frame_metadata`
export class MetadataDecodeError extends Error {}

export const metadataDecoded = effector.sync("metadataDecoded", () =>
  (encoded: string) => {
    try {
      return M.fromPrefixedHex(encoded);
    } catch (e) {
      console.error(e);
      return new MetadataDecodeError();
    }
  });
