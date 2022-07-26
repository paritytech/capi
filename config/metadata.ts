// TODO: more extraction utils

export interface Metadata {
  pallets: Record<string, PalletMetadata>;
}
export namespace Metadata {
  export type GetPallets<M extends Metadata> = M["pallets"];
  export type GetPalletName<M extends Metadata> = keyof GetPallets<M>;
  export type GetPallet<M extends Metadata, PalletName_ extends GetPalletName<M>> = GetPallets<
    M
  >[PalletName_];
}

export interface PalletMetadata {
  entries: Record<string, EntryMeta>;
}
export namespace PalletMetadata {
  export type GetEntries<
    M extends Metadata,
    PalletName_ extends Metadata.GetPalletName<M>,
  > = Metadata.GetPallet<M, PalletName_>["entries"];
  export type GetEntryName<
    M extends Metadata,
    PalletName_ extends Metadata.GetPalletName<M>,
  > = Extract<keyof GetEntries<M, PalletName_>, string>;
  export type GetEntry<
    M extends Metadata,
    PalletName_ extends Metadata.GetPalletName<M>,
    EntryName_ extends GetEntryName<M, PalletName_>,
  > = GetEntries<M, PalletName_>[EntryName_];
}

export interface EntryMeta {
  keys: unknown[];
  value: unknown;
}
