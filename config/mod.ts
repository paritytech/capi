import { ProviderMethods } from "../rpc/mod.ts";
import {
  EntryMeta as EntryMeta_,
  Metadata_,
  PalletMetadata as PalletMetadata_,
} from "./metadata.ts";

declare const rpc_provider_methods_: unique symbol;
declare const metadata_: unique symbol;

/** We represent as a class, not a branded type, because we want to extend into a pretty signature. */
export class Config<
  D = any,
  M extends ProviderMethods = ProviderMethods,
  F extends Metadata_ = Metadata_,
> {
  declare [rpc_provider_methods_]: M;
  declare [metadata_]: F;

  constructor(readonly discoveryValue: D) {}
}

export namespace Config {
  export type Metadata = Metadata_;
  export type PalletMetadata = PalletMetadata_;
  export type EntryMeta = EntryMeta_;

  export function from<M extends ProviderMethods, F extends Metadata_>() {
    return <D>(discoveryValue: D) => {
      return class extends Config<D, M, F> {
        constructor() {
          super(discoveryValue);
        }
      };
    };
  }

  export type GetDiscoveryValue<B extends Config> = B extends Config<infer D> ? D : never;
  export type GetRpcProviderMethods<B extends Config> = B extends
    Config<any, infer M extends ProviderMethods> ? M : never;
  // If you experience a parse error stemming from the following line, update Deno.
  export type GetMetadata<B extends Config> = B extends
    Config<any, ProviderMethods, infer F extends Metadata_> ? F : never;
}
