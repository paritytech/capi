import { AnyEffect, E_, Effect, ResolvedCollection } from "/effect/Base.ts";

export class List<E extends unknown[] = any[]>
  extends Effect<E[number], Extract<E[number], AnyEffect>[E_], ResolvedCollection<E>>
{
  list;

  constructor(...list: E) {
    super();
    this.list = list;
  }
}

export const list = <E extends unknown[]>(...list: E): List<E> => {
  return new List(...list);
};
