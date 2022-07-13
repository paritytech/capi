import { AnyAtom } from "./Atom.ts";
import { E_, T_ } from "./Effect.ts";
import { Visitors } from "./Transform.ts";

export function run<Atom extends AnyAtom>(transform?: Visitors<Atom>) {
  return <Root extends Atom>(root: Root): Promise<T_<Root> | E_<Root>> => {
    return undefined!;
  };
}
