// The nfts pallet uses inverted bitflags; on means exclude and off means include.

export const DefaultCollectionSetting = {
  TransferableItems: 1n << 0n,
  UnlockedMetadata: 1n << 1n,
  UnlockedAttributes: 1n << 2n,
  UnlockedMaxSupply: 1n << 3n,
  DepositRequired: 1n << 4n,
  allOff: 0n,
  allOn: 0b11111n,
}

export const DefaultItemSetting = {
  Transferable: 1n << 0n,
  UnlockedMetadata: 1n << 1n,
  UnlockedAttributes: 1n << 2n,
  allOff: 0n,
  allOn: 0b111n,
}
