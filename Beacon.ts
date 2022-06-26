import { AnyMethods } from "./util/mod.ts";

declare const M_: unique symbol;

export abstract class Beacon<
  DiscoveryValue = any,
  M extends AnyMethods = AnyMethods,
> {
  declare [M_]: M;

  constructor(readonly discoveryValue: DiscoveryValue) {}
}
