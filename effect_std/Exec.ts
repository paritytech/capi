import { _A, _E, _R, Effect } from "./Base.ts";

export class UnknownExecError extends Error {}

export class Exec<Root extends Effect> {
  constructor(readonly root: Root) {}

  run = (runtime: Root[_R]): Promise<Root[_E] | Root[_A]> => {
    return this.#runEffect(runtime, this.root);
  };

  #runEffect = (
    runtime: Root[_R],
    effect: Effect,
    cache = new Map<string, Promise<unknown>>(),
  ): Promise<unknown> => {
    const arg = Promise.all(effect.args.map((arg) => {
      if (arg instanceof Effect) {
        const cacheKey = arg.cacheKey;
        const cached = cache.get(cacheKey);
        if (cached) {
          return cached;
        }
        const pending = this.#runEffect(runtime, arg, cache);
        cache.set(cacheKey, pending);
        return pending;
      }
      return Promise.resolve(arg);
    }));
    return (async () => {
      const depsResolved = await arg;
      return effect.run(...depsResolved)(runtime);
    })();
  };
}
