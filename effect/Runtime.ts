import { _A, _E, _R, AnyEffect } from "/effect/Base.ts";
import { Native } from "/effect/intrinsic/Native.ts";

export class Runtime<Root extends AnyEffect> {
  constructor(readonly root: Root) {}

  run = (env: Root[_R]): Promise<Root[_A | _E]> => {
    return this.runNext(env, this.root);
  };

  runNext = <T>(
    env: Root[_R],
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
    }
    return Promise.resolve(maybeEffect as T);
  };
}

export const runtime = <Root extends AnyEffect>(root: Root): Runtime<Root> => {
  return new Runtime(root);
};
