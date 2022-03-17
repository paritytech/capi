import { MetadataRawV14, Pallet, StorageEntry } from "/frame_metadata/V14.ts";
import * as asserts from "std/testing/asserts.ts";

export class MetadataLookup {
  indexed = false;
  palletIdByName: Record<string, number> = {};
  storageEntryIdByNameByPalletId: Record<number, Record<string, number>> = {};

  constructor(readonly raw: MetadataRawV14) {}

  ensureIndexed = (): void => {
    if (!this.indexed) {
      this.indexed = true;
      this.raw.pallets.forEach((pallet, palletI) => {
        // TODO: `Pallet["index"]` vs. `palletI`... should we even decode the index, or leave it off?
        this.palletIdByName[pallet.name] = palletI;

        pallet.storage?.entries.forEach((entry, entryI) => {
          this.storageEntryIdByNameByPalletId[palletI] = this.storageEntryIdByNameByPalletId[palletI] || {};
          this.storageEntryIdByNameByPalletId[palletI]![entry.name] = entryI;
        });
      });
    }
  };

  getPallet = (palletName: string): Pallet => {
    this.ensureIndexed();
    const palletI = this.palletIdByName[palletName];
    asserts.assert(typeof palletI === "number");
    const pallet = this.raw.pallets[palletI];
    asserts.assert(pallet);
    return pallet;
  };

  getStorageEntry = (
    palletName: string,
    storageEntryName: string,
  ): StorageEntry => {
    this.ensureIndexed();
    const palletI = this.palletIdByName[palletName];
    asserts.assert(typeof palletI === "number");
    const palletStorageEntryIByNames = this.storageEntryIdByNameByPalletId[palletI];
    asserts.assert(palletStorageEntryIByNames);
    const storageEntryId = palletStorageEntryIByNames[storageEntryName];
    asserts.assert(typeof storageEntryId === "number");
    const storageEntry = this.raw.pallets[palletI]?.storage?.entries?.[storageEntryId];
    asserts.assert(storageEntry);
    return storageEntry;
  };
}
