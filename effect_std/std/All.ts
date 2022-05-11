import { AllResolved, Effect } from "../Base.ts";

export class All<E extends unknown[]> extends Effect<E, AllResolved<E>, never, {}> {
  constructor(...all: E) {
    super(all, (...allResolved) => {
      return async () => {
        return allResolved;
      };
    });
  }
}

export const all = <E extends unknown[]>(...all: E): All<E> => {
  return new All(...all);
};
