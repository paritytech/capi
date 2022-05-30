import { effector } from "/effect/Effect.ts";
import * as M from "/frame_metadata/mod.ts";

// TODO: move into & get from `frame_metadata`
export class DeriveCodecError extends Error {}

export const deriveCodec = effector.sync("deriveCodec", () =>
  (metadata: M.Metadata) => {
    return M.DeriveCodec(metadata);
  });
