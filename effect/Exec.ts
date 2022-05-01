import { _A, _E, _R, AnyEffect } from "./Base.ts";

export class Exec<Root extends AnyEffect> {
  resolved = new Map<AnyEffect, unknown>();

  constructor(readonly root: Root) {}

  #runEffect = async (
    runtime: Root[_R],
    effect: AnyEffect,
  ): Promise<unknown> => {
    const depsResolved = await Promise.all((effect.deps as AnyEffect[]).map((dep) => {
      return this.#runEffect(runtime, dep);
    }));
    try {
      const previous = this.resolved.get(effect);
      if (previous) {
        return previous;
      }
      const resolved = await effect.run(runtime, ...depsResolved);
      this.resolved.set(effect, resolved);
      return resolved;
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
