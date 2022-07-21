// TODO: more extraction utils

export interface Metadata_ {
  pallets: Record<string, PalletMetadata>;
}
export namespace Metadata_ {
  export type GetPallets<M extends Metadata_> = M["pallets"];
  export type GetPalletName<M extends Metadata_> = keyof GetPallets<M>;
  export type GetPallet<M extends Metadata_, PalletName_ extends GetPalletName<M>> = GetPallets<
    M
  >[PalletName_];
}

export interface PalletMetadata {
  entries: Record<string, EntryMeta>;
}
export namespace PalletMetadata {
  export type GetEntries<
    M extends Metadata_,
    PalletName_ extends Metadata_.GetPalletName<M>,
  > = Metadata_.GetPallet<M, PalletName_>["entries"];
  export type GetEntryName<
    M extends Metadata_,
    PalletName_ extends Metadata_.GetPalletName<M>,
  > = Extract<keyof GetEntries<M, PalletName_>, string>;
  export type GetEntry<
    M extends Metadata_,
    PalletName_ extends Metadata_.GetPalletName<M>,
    EntryName_ extends GetEntryName<M, PalletName_>,
  > = GetEntries<M, PalletName_>[EntryName_];
}

export interface EntryMeta {
  keys: unknown[];
  value: unknown;
}
