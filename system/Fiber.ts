import * as u from "/_/util/mod.ts";
import { Context } from "/system/Context.ts";
import * as z from "/system/Effect.ts";
import { abortable } from "std/async/abortable.ts";

export class Fiber<Root extends z.AnyEffect> {
  constructor(readonly root: Root) {}

  async run(runtime: Root[z._R]): Promise<u.Result<Root[z._E] | Error, Root[z._A]>> {
    const context = new Context(this.root);
    const result = await next(this.root, runtime, context);
    await Promise.all(context.cleanup.map((cb) => cb()));
    return result;
  }
}

// TODO: make this stack-based?
// TODO: story around cancellation / abort controller usage
// TODO: introduce suspend / resume
// TODO: OPTIMIZE!
const next = async (
  root: z.AnyEffect,
  runtime: unknown,
  context: Context,
): Promise<u.Result<Error, unknown>> => {
  const depsEntries: [PropertyKey, z.AnyEffect][] = Object.entries(root.deps);
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
          context.abortController.signal,
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
