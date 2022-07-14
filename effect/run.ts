import { CapiAtom } from "./atoms/mod.ts";
import { Run } from "./sys/mod.ts";

export const run = Run<CapiAtom>((atom) => {
  return atom;
});
