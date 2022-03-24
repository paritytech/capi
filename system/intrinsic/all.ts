import * as u from "/_/util/mod.ts";
import * as z from "/system/Effect.ts";
import { none } from "/system/intrinsic/misc.ts";

// Ensure mapping is homomorphic
type AllResolved<D> = { [K in keyof D]: AllResolved_0<D[K]> };
type AllResolved_0<T> = T extends z.AnyEffect ? T[z._A] : T;

type UndefinedElementsToNone<Elements extends (z.AnyEffect | undefined)[]> = {
  [Key in keyof Elements as Key extends `${number}` ? Key : never]: Elements[Key] extends z.AnyEffect ? Elements[Key]
    : Elements[Key] extends z.AnyEffect | undefined ? Extract<Elements[Key], z.AnyEffect> | none
    : none;
};

export class All<Elements extends (z.AnyEffect | undefined)[]> extends z.Effect<
  {},
  u.Result<never, AllResolved<UndefinedElementsToNone<Elements>>>,
  UndefinedElementsToNone<Elements>
> {
  constructor(readonly elements: Elements) {
    const elementRec: Record<number, z.AnyEffect> = {};
    elements.forEach((element, i) => {
      elementRec[i] = element || none;
    });
    super("All", elementRec as UndefinedElementsToNone<Elements>, async (_, resolved) => {
      const elementsResolved: any[] = [];
      for (let i = 0; i < elements.length; i++) {
        const resolvedElements = (resolved as any)[i];
        elementsResolved.push(resolvedElements);
      }
      return u.ok(elementsResolved as any as AllResolved<UndefinedElementsToNone<Elements>>);
    }, z.EffectFlags.None);
  }
}

export const all = <Elements extends (z.AnyEffect | undefined)[]>(...elements: Elements): All<Elements> => {
  return new All(elements);
};
