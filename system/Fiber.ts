import { Context } from "/system/Context.ts";
import * as Z from "/system/Effect.ts";
import { Result } from "/system/Result.ts";
import { abortable } from "std/async/abortable.ts";

export const Fiber = async <Root extends Z.AnyEffect>(
  root: Root,
  runtime: Root[Z._R],
): Promise<Result<Root[Z._E] | Error, Root[Z._A]>> => {
  const context = new Context(root);
  const result = await next(root, runtime, context);
  await Promise.all(context.cleanup.map((cb) => cb()));
  return result;
};

// TODO: make this stack-based?
// TODO: story around cancellation / abort controller usage
// TODO: introduce suspend / resume
// TODO: OPTIMIZE!
const next = async (
  root: Z.AnyEffect,
  runtime: unknown,
  context: Context,
): Promise<Result<Error, unknown>> => {
  const depsEntries: [PropertyKey, Z.AnyEffect][] = Object.entries(root.deps);
  try {
    const depsPending: Promise<unknown>[] = [];
    for (let i = 0; i < depsEntries.length; i++) {
      const [_depName, dep] = depsEntries[i]!;
      const alreadyPending = context.visited.get(dep);
      if (alreadyPending) {
        depsPending.push(alreadyPending);
      } else {
        const depPending: Promise<unknown> = abortable(
          (async () => {
            const result = await next(dep, runtime, context);
            if (result instanceof Error) {
              context.err = result;
              throw context.err;
              // TODO: re-enable once you correctly propagate the error
              // fiberCtx.controller.abort();
            }
            return result.value;
          })(),
          context.controller.signal,
        );
        context.visited.set(dep, depPending);
        depsPending.push(depPending);
      }
    }
    const depsResolved = await Promise.all(depsPending);
    const depsResolvedRec = depsResolved.reduce<Record<PropertyKey, unknown>>((acc, curr, i) => {
      return {
        ...acc,
        [depsEntries[i]![0]!]: curr, // TODO: assertions
      };
    }, {});
    return root.run(runtime, depsResolvedRec, context);
  } catch (e) {
    // Check if DOMException?
    if (context.err) {
      return context.err;
    }
    return e;
  }
};
