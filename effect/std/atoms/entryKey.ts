import { hashers } from "/bindings/mod.ts";
import { effector } from "/effect/Effect.ts";
import * as M from "/frame_metadata/mod.ts";

export const entryKey = effector.sync(
  "entryKey",
  () =>
    (
      deriveCodec: M.DeriveCodec,
      palletMetadata: M.Pallet,
      entryMetadata: M.StorageEntry,
      a?: unknown,
      b?: unknown,
    ) => {
      return M.encodeKey(deriveCodec, hashers, palletMetadata, entryMetadata, a, b);
    },
);
