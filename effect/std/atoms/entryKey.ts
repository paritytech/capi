import { hashers } from "/crypto/mod.ts";
import { effector } from "/effect/Effect.ts";
import * as m from "/frame_metadata/mod.ts";

export const entryKey = effector.sync(
  "entryKey",
  () =>
    (deriveCodec: m.DeriveCodec, palletMetadata: m.Pallet, entryMetadata: m.StorageEntry, a?: unknown, b?: unknown) => {
      return m.encodeKey(deriveCodec, hashers, palletMetadata, entryMetadata, a, b);
    },
);
