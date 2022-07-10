import { AnyMethods } from "./util/mod.ts";

export class Config<
  D = any,
  M extends AnyMethods = AnyMethods,
  F extends Meta = Meta,
> {
  declare rpc: M;
  declare frame: F;

  constructor(readonly discoveryValue: D) {}
}

export namespace Config {
  export type F_<B extends Config> = B extends Config<any, AnyMethods, infer F extends Meta> ? F
    : never;

  export type Pallets<B extends Config> = F_<B>["pallets"];
  export type PalletName<B extends Config> = keyof Pallets<B>;
  export type Pallet<B extends Config, PalletName_ extends PalletName<B>> = Pallets<B>[PalletName_];

  export type Entries<
    B extends Config,
    PalletName_ extends PalletName<B>,
  > = Pallet<B, PalletName_>["entries"];
  export type EntryName<
    B extends Config,
    PalletName_ extends PalletName<B>,
  > = Extract<keyof Entries<B, PalletName_>, string>;
  export type Entry<
    B extends Config,
    PalletName_ extends PalletName<B>,
    EntryName_ extends EntryName<B, PalletName_>,
  > = Entries<B, PalletName_>[EntryName_];

  export type D_<B extends Config> = B extends Config<infer D> ? D : never;
  export type M_<B extends Config> = B extends Config<any, infer M extends AnyMethods> ? M
    : never;
}

export function config<
  M extends AnyMethods,
  F extends Meta,
>() {
  return <D>(discoveryValue: D) => {
    return class extends Config<D, M, F> {
      constructor() {
        super(discoveryValue);
      }
    };
  };
}

//

export type Meta<T extends Meta = AnyMeta> = T;
interface AnyMeta {
  pallets: Record<string, PalletMeta>;
}

export interface PalletMeta {
  entries: Record<string, EntryMeta>;
}

export interface EntryMeta {
  keys: unknown[];
  value: unknown;
}
