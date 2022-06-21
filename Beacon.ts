import { AnyMethods } from "./util/mod.ts";

export type DiscoveryValues<DiscoveryValue> = [DiscoveryValue, ...DiscoveryValue[]];

declare const _RpcMethods: unique symbol;

// TODO: parameterize address kind & misc.
export class Beacon<D = any, M extends AnyMethods = AnyMethods> {
  declare [_RpcMethods]: M;

  discoveryValues;

  constructor(...discoveryValues: DiscoveryValues<D>) {
    this.discoveryValues = discoveryValues;
  }
}
export function beacon<D, M extends AnyMethods>(
  ...discoveryValues: DiscoveryValues<D>
): Beacon<D, M> {
  return new Beacon(...discoveryValues);
}
