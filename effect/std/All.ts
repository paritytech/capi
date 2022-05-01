import { AnyEffect, Effect, Resolved } from "../Base.ts";

export class All<E extends AnyEffect[]> extends Effect<{}, never, Resolved<E>, E> {
  constructor(...effects: E) {
    super(effects, async (_, ...resolved) => {
      return resolved;
    });
  }
}

export const all = <E extends AnyEffect[]>(...effects: E): All<E> => {
  return new All(...effects);
};
