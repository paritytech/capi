import { effector } from "/effect/Effect.ts";
import { HashersR } from "/env/mod.ts";
import * as m from "/frame_metadata/mod.ts";

// TODO
declare const hashers: HashersR["hashers"];

export const entryKey = effector.sync(
  "entryKey",
  () =>
    (deriveCodec: m.DeriveCodec, palletMetadata: m.Pallet, entryMetadata: m.StorageEntry, a?: unknown, b?: unknown) => {
      return m.encodeKey(deriveCodec, hashers, palletMetadata, entryMetadata, a, b);
    },
);
