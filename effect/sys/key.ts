import { Atom } from "./Atom.ts";

let i = 0; // TODO: make fqn optional
const refKeys = new Map<unknown, string>();
export function key(val: unknown): string {
  let refKey = refKeys.get(val);
  if (refKey) {
    return refKey;
  }
  if (val instanceof Atom) {
    refKey = `${val.fqn}(${(val.args as any[]).map(key)})`;
    refKeys.set(val, refKey);
    return refKey;
  }
  refKey = `_${i++}`;
  refKeys.set(val, refKey);
  return refKey;
}
