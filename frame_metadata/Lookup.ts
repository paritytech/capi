import * as m from "./Metadata.ts";

type StorageEntryByNameByPalletName = Record<string, Record<string, m.StorageEntry>>;

export class Lookup {
  indexed = false;
  palletByName: Record<string, m.Pallet> = {};
  storageEntryByNameByPalletName: StorageEntryByNameByPalletName = {};
  callByNameByPalletName: Record<string, Record<string, m.UnionTypeDefMember>> = {};

  constructor(readonly metadata: m.Metadata) {}

  ensureIndexed = (): void => {
    if (!this.indexed) {
      this.metadata.pallets.forEach((pallet) => {
        this.palletByName[pallet.name] = pallet;

        const palletEntries: Record<string, m.StorageEntry> = {};
        this.storageEntryByNameByPalletName[pallet.name] = palletEntries;

        const palletCallIndices: Record<string, m.UnionTypeDefMember> = {};
        this.callByNameByPalletName[pallet.name] = palletCallIndices;

        pallet.storage?.entries.forEach((entry) => {
          palletEntries[entry.name] = entry;
        });

        if (pallet.calls) {
          const callType = this.metadata.types[pallet.calls.type];
          if (!callType) {
            throw new Error();
          }
          if (callType._tag !== m.TypeKind.Union) {
            throw new Error();
          }
          callType.members.forEach((member) => {
            palletCallIndices[member.name] = member;
          });
        }
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

  getCallByPalletAndName = (
    pallet: m.Pallet,
    name: string,
  ): m.UnionTypeDefMember => {
    this.ensureIndexed();
    const palletCalls = this.callByNameByPalletName[pallet.name];
    if (!palletCalls) {
      throw new Error();
    }
    if (palletCalls === undefined) {
      throw new Error();
    }
    const call = palletCalls[name];
    if (call === undefined) {
      throw new Error();
    }
    return call;
  };
}

class PalletDne extends Error {}
class StorageEntryDne extends Error {}
