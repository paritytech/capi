import { AnyMethods } from "./util/mod.ts";

export type DiscoveryValues = [string, ...string[]];

declare const _RpcMethods: unique symbol;

// TODO: parameterize address kind & misc.
export class Beacon<M extends AnyMethods = AnyMethods> {
  declare [_RpcMethods]: M;

  discoveryValues;

  constructor(...discoveryValues: DiscoveryValues) {
    this.discoveryValues = discoveryValues;
  }
}
export function beacon<M extends AnyMethods>(...discoveryValues: DiscoveryValues): Beacon<M> {
  return new Beacon(...discoveryValues);
}
