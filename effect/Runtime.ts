import { _A, _E, _R, AnyEffect, ExtractEffect, HOEffect } from "/effect/Base.ts";
import { Native } from "/effect/intrinsic/Native.ts";
import { Select } from "/effect/intrinsic/Select.ts";

export class Runtime<Root extends AnyEffect | HOEffect> {
  constructor(readonly root: Root) {}

  run = (env: ExtractEffect<Root>[_R]): Promise<ExtractEffect<Root>[_A | _E]> => {
    return this.runNext(env, this.root);
  };

  runNext = <T>(
    env: ExtractEffect<Root>[_R],
    maybeEffect: unknown,
  ): Promise<T> => {
    if (maybeEffect instanceof Native) {
      // TODO: why is this casting necessary?
      const depsPending = Promise.all((maybeEffect.args as AnyEffect[]).map((dep) => {
        const pending = this.runNext(env, dep);
        return pending;
      }));
      return (async () => {
        const deps = await depsPending;
        return maybeEffect.run(...deps)(env);
      })();
    } else if (maybeEffect instanceof Select) {
      return (async () => {
        const result = await this.runNext(env, maybeEffect.target) as any;
        return result[maybeEffect.key];
      })();
    } else if (maybeEffect instanceof HOEffect) {
      return this.runNext(env, maybeEffect.root);
    }
    return Promise.resolve(maybeEffect as T);
  };
}

export const runtime = <Root extends AnyEffect | HOEffect>(root: Root): Runtime<Root> => {
  return new Runtime(root);
};
