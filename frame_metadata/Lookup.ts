import * as m from "./Metadata.ts";

type StorageEntryByNameByPalletName = Record<string, Record<string, m.StorageEntry>>;

export class Lookup {
  indexed = false;
  palletByName: Record<string, m.Pallet> = {};
  storageEntryByNameByPalletName: StorageEntryByNameByPalletName = {};

  constructor(readonly metadata: m.Metadata) {}

  ensureIndexed = (): void => {
    if (!this.indexed) {
      this.metadata.pallets.forEach((pallet) => {
        this.palletByName[pallet.name] = pallet;
        const palletEntries: Record<string, m.StorageEntry> = {};
        this.storageEntryByNameByPalletName[pallet.name] = palletEntries;
        pallet.storage?.entries.forEach((entry) => {
          palletEntries[entry.name] = entry;
        });
      });
      this.indexed = true;
    }
  };

  getPalletByName = (palletName: string) => {
    this.ensureIndexed();
    const pallet = this.palletByName[palletName];
    if (!pallet) {
      throw new PalletDne();
    }
    return pallet;
  };

  getStorageEntryByPalletAndName = (
    pallet: m.Pallet,
    storageEntryName: string,
  ): m.StorageEntry => {
    this.ensureIndexed();
    const palletStorageEntries = this.storageEntryByNameByPalletName[pallet.name];
    if (!palletStorageEntries) {
      throw new PalletDne();
    }
    const storageEntry = palletStorageEntries[storageEntryName];
    if (!storageEntry) {
      throw new StorageEntryDne();
    }
    return storageEntry;
  };

  getStorageEntryByPalletNameAndName = (
    palletName: string,
    storageEntryName: string,
  ): m.StorageEntry => {
    const pallet = this.getPalletByName(palletName);
    return this.getStorageEntryByPalletAndName(pallet, storageEntryName);
  };
}

class PalletDne extends Error {}
class StorageEntryDne extends Error {}
