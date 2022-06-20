import * as rpc from "../rpc/mod.ts";

export type DiscoveryValues = [string, ...string[]];

declare const _M: unique symbol;

export class Beacon<M extends rpc.AnyMethods> {
  declare [_M]: M;
  discoveryValues;

  constructor(...discoveryValues: DiscoveryValues) {
    this.discoveryValues = discoveryValues;
  }
}
export function beacon<M extends rpc.AnyMethods>(...discoveryValues: DiscoveryValues): Beacon<M> {
  return new Beacon(...discoveryValues);
}
