import { AnyMethods } from "./util/mod.ts";

export declare const M_: unique symbol;
export type M_<B extends Beacon> = B extends Beacon<infer M> ? M : never;

export declare const D_: unique symbol;
export type D_<B extends Beacon> = B extends Beacon<AnyMethods, infer D> ? D : never;

export class Beacon<
  M extends AnyMethods = AnyMethods,
  DiscoveryValue = any,
> {
  declare [M_]: M;

  constructor(readonly discoveryValue: DiscoveryValue) {}
}
export function beacon<
  M extends AnyMethods,
  DiscoveryValue,
>(discoveryValue: DiscoveryValue): Beacon<M, DiscoveryValue> {
  return new Beacon(discoveryValue);
}
