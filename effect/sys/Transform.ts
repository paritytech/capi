import { AnyAtom } from "./Atom.ts";

export type Visitors<Atom extends AnyAtom> = {
  [Fqn in Atom["fqn"]]: (atom: Extract<Atom, { fqn: Fqn }>) => Atom;
};
