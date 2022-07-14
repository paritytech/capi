import { AnyAtom, Atom } from "./Atom.ts";
import { E_, T_ } from "./Effect.ts";

export function Run<Atom extends AnyAtom>(transform: (root: Atom) => Atom) {
  const cache = new Map<string, unknown>();

  return async <Root extends Atom>(root: Root): Promise<T_<Root> | E_<Root>> => {
    try {
      const dependents = new Map<Atom, Promise<unknown>[]>();
      const cleanup = new Map<Atom, () => void | Promise<void>>();
      const cleanupPending: (void | Promise<void>)[] = [];
      const rootResult = await visit<T_<Root>>(transform(root), dependents, cleanup);
      for (const [k, v] of dependents) {
        const c = cleanup.get(k);
        if (c) {
          cleanupPending.push((async () => {
            await Promise.all(v);
            await c();
          })());
        }
      }
      await Promise.all(cleanupPending);
      return rootResult;
    } catch (e) {
      return e as E_<Root>;
    }
  };

  async function visit<T>(
    val: unknown,
    dependents: Map<Atom, Promise<unknown>[]>,
    cleanup: Map<Atom, () => void | Promise<void>>,
  ): Promise<T> {
    const k = key(val);
    if (cache.has(k)) {
      return cache.get(k) as T;
    }
    if (val instanceof Atom) {
      return (async () => {
        const args: any[] = val.args;
        const argsResolved = await Promise.all((args as any[]).map((arg) => {
          return visit(arg, dependents, cleanup);
        }));
        const pending = val.impl(...argsResolved);
        args.forEach((arg) => {
          if (arg instanceof Atom) {
            let e = dependents.get(arg as Atom);
            if (e) {
              e.push(pending);
            } else {
              e = [pending];
              dependents.set(arg as Atom, e);
            }
          }
        });
        const resolved = await pending;
        if (resolved instanceof Error) {
          throw resolved;
        }
        if (val.exit) {
          const applied = () => val.exit!(resolved);
          cleanup.set(val as Atom, applied);
        }
        return resolved;
      })();
    }
    return val as T;
  }
}

// TODO: make fqn optional
let i = 0;
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
