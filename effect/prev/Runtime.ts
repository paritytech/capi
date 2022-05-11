import { A_, AnyEffect, E_ } from "/effect/Base.ts";
import { FlatMap } from "/effect/intrinsic/FlatMap.ts";
import { Lift } from "/effect/intrinsic/Lift.ts";
import { List } from "/effect/intrinsic/List.ts";
import { Env, Native } from "/effect/intrinsic/Native.ts";
import { Rec } from "/effect/intrinsic/Rec.ts";
import { TryCatch } from "/effect/intrinsic/TryCatch.ts";

export class Runtime<Root extends AnyEffect> {
  constructor(readonly root: Root) {}

  run = (env: Env<Root>): Promise<Root[A_ | E_]> => {
    return this.runNext(env, this.root);
  };

  runNext = <T>(
    env: Env<Root>,
    maybeEffect: unknown,
  ): Promise<T> => {
    if (maybeEffect instanceof FlatMap) {
    } else if (maybeEffect instanceof Lift) {
    } else if (maybeEffect instanceof List) {
    } else if (maybeEffect instanceof Rec) {
    } else if (maybeEffect instanceof Native) {
      const depsPending = Promise.all((maybeEffect.deps as AnyEffect[]).map((dep) => {
        const pending = this.runNext(env, dep);
        return pending;
      }));
      return (async () => {
        const deps = await depsPending;
        return maybeEffect.resolve(...deps)(env);
      })();
    } else if (maybeEffect instanceof TryCatch) {
    }
    return Promise.resolve(maybeEffect as T);
  };
}

export const runtime = <Root extends AnyEffect>(root: Root): Runtime<Root> => {
  return new Runtime(root);
};
