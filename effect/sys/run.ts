import { AnyAtom, Atom } from "./Atom.ts";
import { E_, T_ } from "./Effect.ts";
import { key } from "./key.ts";

// TODO: eventually refactor this to contain `V` / atom-specific runtime
export interface RunContext {
  run: Run;
}
export type RunResult<Root extends AnyAtom> = Promise<T_<Root> | E_<Root>>;
export type Run = <Root extends AnyAtom>(root: Root) => RunResult<Root>;

export const { run } = (new class Runtime implements RunContext {
  #cache = new Map<string, Promise<unknown>>(); // TODO: set max size / use LRU

  run = async <Root extends AnyAtom>(root: Root) => {
    const dependents = new Map<AnyAtom, Promise<unknown>[]>();
    const cleanup = new Map<AnyAtom, () => void | Promise<void>>();
    const cleanupPending: (void | Promise<void>)[] = [];
    try {
      const rootResult = await this.visit<T_<Root>>(root, dependents, cleanup);
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

  visit = <T>(
    val: unknown,
    dependents: Map<AnyAtom, Promise<unknown>[]>,
    cleanup: Map<AnyAtom, () => void | Promise<void>>,
  ): T | Promise<T> => {
    const k = key(val);
    if (this.#cache.has(k)) {
      return this.#cache.get(k) as Promise<T>;
    }
    if (val instanceof Atom) {
      return (async () => {
        const args: any[] = val.args;
        const argsPending = Promise.all((args as any[]).map((arg) => {
          return this.visit(arg, dependents, cleanup);
        }));
        const pending = argsPending.then((argsResolved) => {
          return val.impl.bind(this)(...argsResolved);
        });
        this.#cache.set(k, pending);
        args.forEach((arg) => {
          if (arg instanceof Atom) {
            this.addDependent(dependents, pending, arg);
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
  };

  addDependent = (
    dependents: Map<AnyAtom, Promise<unknown>[]>,
    dependency: Promise<any>,
    dependent: AnyAtom,
  ) => {
    let e = dependents.get(dependent);
    if (e) {
      e.push(dependency);
    } else {
      e = [dependency];
      dependents.set(dependent, e);
    }
  };
}());
