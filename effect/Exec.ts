import { _A, _E, _R, AnyEffect, Effect } from "./Base.ts";

export class Exec<Root extends AnyEffect> {
  executions = new Map<AnyEffect, Promise<unknown>>();

  constructor(readonly root: Root) {}

  #runEffect = async (
    runtime: Root[_R],
    effect: Effect<any, Error, any, AnyEffect[]>,
  ): Promise<unknown> => {
    console.log(effect.structure);
    const depsResolved = await Promise.all(effect.deps.map((dep) => {
      return this.#runEffect(runtime, dep);
    }));
    try {
      const previous = this.executions.get(effect);
      if (previous) {
        return previous;
      }
      const pending = effect.run(runtime, ...depsResolved);
      this.executions.set(effect, pending);
      return await pending;
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }
      return new Error();
    }
  };

  run = (runtime: Root[_R]): Promise<Root[_E] | Root[_A]> => {
    return this.#runEffect(runtime, this.root);
  };
}

export const exec = <Root extends AnyEffect>(root: Root): Exec<Root> => {
  return new Exec(root);
};
