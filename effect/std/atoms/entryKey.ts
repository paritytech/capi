import { MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import * as m from "/frame_metadata/mod.ts";
import { HasherRuntime } from "/runtime/Hashers.ts";

export const entryKey = <
  DeriveCodec extends MaybeEffectLike<m.DeriveCodec>,
  PalletMetadata extends MaybeEffectLike<m.Pallet>,
  EntryMetadata extends MaybeEffectLike<m.StorageEntry>,
  Keys extends [
    a?: unknown,
    b?: unknown,
  ],
>(
  deriveCodec: DeriveCodec,
  palletMetadata: PalletMetadata,
  entryMetadata: EntryMetadata,
  ...keys: Keys
) => {
  const args: [DeriveCodec, PalletMetadata, EntryMetadata, ...Keys] = [
    deriveCodec,
    palletMetadata,
    entryMetadata,
    ...keys,
  ];
  return native(
    args,
    (deriveCodec, palletMetadata, entryMetadata, ...keys) => {
      return async (env: HasherRuntime) => {
        return m.encodeKey(deriveCodec, env.hashers, palletMetadata, entryMetadata, ...keys);
      };
    },
  );
};
