import { _A, _E, _R, AnyEffect, Effect } from "./Base.ts";

export class Exec<Root extends AnyEffect> {
  #cache = new Map<string, Promise<unknown>>();

  constructor(readonly root: Root) {}

  run = (runtime: Root[_R]): Promise<Root[_E] | Root[_A]> => {
    return this.#runEffect(runtime, this.root);
  };

  #runEffect = (
    runtime: Root[_R],
    effect: Effect<any, any, any, AnyEffect[]>,
  ): Promise<unknown> => {
    const deps = Promise.all(effect.deps.map((dep) => {
      if (dep instanceof Effect) {
        const cacheKey = dep.cacheKey;
        const cached = this.#cache.get(cacheKey);
        if (cached) {
          return cached;
        }
        const pending = this.#runEffect(runtime, dep);
        this.#cache.set(cacheKey, pending);
        return pending;
      }
      return Promise.resolve(dep);
    }));
    return (async () => {
      const depsResolved = await deps;
      return effect.run(runtime, ...depsResolved);
    })();
  };
}

export const exec = <Root extends AnyEffect>(root: Root): Exec<Root> => {
  return new Exec(root);
};

export class UnknownExecError extends Error {}
