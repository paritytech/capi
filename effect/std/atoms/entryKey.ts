import { MaybeEffectLike } from "/effect/Effect.ts";
import { step } from "/effect/intrinsic/Step.ts";
import { HashersR } from "/env/mod.ts";
import * as m from "/frame_metadata/mod.ts";

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
  return step(
    "EntryKey",
    [deriveCodec, palletMetadata, entryMetadata, ...keys],
    (deriveCodec, palletMetadata, entryMetadata, ...keys) => {
      return async (env: HashersR) => {
        return m.encodeKey(deriveCodec, env.hashers, palletMetadata, entryMetadata, ...keys);
      };
    },
  );
};
