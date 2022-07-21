import { AnyAtom, Atom } from "./Atom.ts";
import { AnyEffect, E_, T_ } from "./Effect.ts";
import { key } from "./key.ts";

// Eventually, we'll refactor this to contain any `V` / atom-specified runtime requirements
export interface RunContext {
  run: Run;
}

export type Run = <Root extends AnyAtom>(root: Root) => Promise<T_<Root> | E_<Root>>;

export function Run(transform?: (root: AnyAtom) => AnyEffect): Run {
  const cache = new Map<string, Promise<unknown>>(); // TODO: set max size / use LRU
  const ctx: RunContext = { run };
  return run;

  async function run<Root extends AnyAtom>(root: Root) {
    try {
      const dependents = new Map<AnyAtom, Promise<unknown>[]>();
      const cleanup = new Map<AnyAtom, () => void | Promise<void>>();
      const cleanupPending: (void | Promise<void>)[] = [];
      const rootResult = await visit<T_<Root>>(
        transform ? transform(root) : root,
        dependents,
        cleanup,
      );
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
  }

  function visit<T>(
    val: unknown,
    dependents: Map<AnyAtom, Promise<unknown>[]>,
    cleanup: Map<AnyAtom, () => void | Promise<void>>,
  ): T | Promise<T> {
    const k = key(val);
    if (cache.has(k)) {
      return cache.get(k) as Promise<T>;
    }
    if (val instanceof Atom) {
      return (async () => {
        const args: any[] = val.args;
        const argsPending = Promise.all((args as any[]).map((arg) => {
          return visit(arg, dependents, cleanup);
        }));
        const pending = argsPending.then((argsResolved) => {
          return val.impl.bind(ctx)(...argsResolved);
        });
        cache.set(k, pending);
        args.forEach((arg) => {
          if (arg instanceof Atom) {
            let e = dependents.get(arg);
            if (e) {
              e.push(pending);
            } else {
              e = [pending];
              dependents.set(arg, e);
            }
          }
        });
        const resolved = await pending;
        if (resolved instanceof Error) {
          throw resolved;
        }
        if (val.exit) {
          const applied = () => val.exit!(resolved);
          cleanup.set(val, applied);
        }
        return resolved;
      })();
    }
    return val as T;
  }
}
