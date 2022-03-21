import * as u from "/_/util/mod.ts";
import { ChainResolved } from "/frame/Chain.ts";
import { StorageEntry as StorageEntryRaw } from "/frame_metadata/V14.ts";
import * as s from "/system/mod.ts";

export interface StorageEntryResolved<Beacon> {
  chain: ChainResolved<Beacon>;
  palletName: string;
  raw: StorageEntryRaw;
}

export const StorageEntry = <
  Beacon,
  Chain extends s.AnyEffectA<ChainResolved<Beacon>>,
  PalletName extends string,
  StorageEntryName extends string,
>(
  chain: Chain,
  palletName: PalletName,
  storageEntryName: StorageEntryName,
) => {
  return s.effect<StorageEntryResolved<Beacon>>()(
    "FrameStorageEntry",
    { chain },
    async (_, resolved) => {
      return u.ok({
        chain: resolved.chain,
        palletName,
        raw: resolved.chain.metadata.lookup.getStorageEntry(palletName, storageEntryName),
      });
    },
  );
};
