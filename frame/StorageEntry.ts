import { ChainResolved } from "/frame/Chain.ts";
import { StorageEntry as StorageEntryRaw } from "/frame_metadata/V14.ts";
import * as sys from "/system/mod.ts";

export interface StorageEntryResolved<Beacon> {
  chain: ChainResolved<Beacon>;
  palletName: string;
  raw: StorageEntryRaw;
}

export const StorageEntry = <
  Beacon,
  PalletName extends string,
  StorageEntryName extends string,
>(
  chain: sys.AnyEffectA<ChainResolved<Beacon>>,
  palletName: PalletName,
  storageEntryName: StorageEntryName,
) => {
  return sys.effect<StorageEntryResolved<Beacon>>()(
    "FrameStorageEntry",
    { chain },
    async (_, resolved) => {
      return sys.ok({
        chain: resolved.chain,
        palletName,
        raw: resolved.chain.metadata.lookup.getStorageEntry(palletName, storageEntryName),
      });
    },
  );
};
