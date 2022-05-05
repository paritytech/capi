import * as a from "std/async/mod.ts";
import { _A, _E, _R, AnyEffect, Effect } from "./Base.ts";

export class Exec<Root extends AnyEffect> {
  cache = new Map<string, Promise<unknown>>();

  constructor(readonly root: Root) {}

  #runEffect = (
    runtime: Root[_R],
    effect: Effect<any, Error, any, AnyEffect[]>,
  ): string => {
    const cacheKey = effect.cacheKey;
    if (!this.cache.has(cacheKey)) {
      effect.deps.forEach((dep) => {
        this.#runEffect(runtime, dep);
      });
      const pending = a.deferred();
      this.cache.set(cacheKey, pending);
      Promise.all(effect.deps.map((dep) => {
        return this.cache.get(dep.cacheKey);
      })).then((depsResolved) => {
        effect.run(runtime, ...depsResolved).then((resolved) => {
          pending.resolve(resolved);
        });
      }).catch((e) => {
        pending.reject(e);
      });
    }
    return cacheKey;
  };

  run = (runtime: Root[_R]): Promise<Root[_E] | Root[_A]> => {
    const cacheKey = this.#runEffect(runtime, this.root);
    return this.cache.get(cacheKey)!;
  };
}

export const exec = <Root extends AnyEffect>(root: Root): Exec<Root> => {
  return new Exec(root);
};

export class UnknownExecError extends Error {}
