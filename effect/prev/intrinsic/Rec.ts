import { AnyEffect, E_, Effect, ResolvedCollection } from "/effect/Base.ts";
import * as U from "/util/mod.ts";

export class Rec<D extends Record<PropertyKey, unknown> = Record<PropertyKey, any>>
  extends Effect<U.ValueOf<D>, Extract<U.ValueOf<D>, AnyEffect>[E_], ResolvedCollection<D>>
{
  constructor(readonly rec: D) {
    super();
  }
}

export const rec = <D extends Record<PropertyKey, unknown>>(rec: D): Rec<D> => {
  return new Rec(rec);
};
