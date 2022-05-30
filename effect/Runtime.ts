import * as Z from "../effect/Effect.ts";
import { AnyStep, Step } from "../effect/intrinsic/Step.ts";

export interface Runtime<CommonR> {
  <
    Root extends Z.AnyEffectLike,
    R extends Omit<Z.UnwrapR<Root>, keyof CommonR>,
  >(
    root: Root,
    ...[env]: [{}] extends [R] ? [] : [R]
  ): Promise<Z.UnwrapE<Root> | Z.UnwrapA<Root>>;
}

export function runtime<CommonR>(sharedEnv: CommonR = ({} as any)): Runtime<CommonR> {
  const cache = new Map<string, Promise<unknown>>();
  const cleanup: (() => Promise<void>)[] = [];

  return (async (root, env) => {
    const finalEnv = {
      ...sharedEnv,
      ...env || {},
    };

    const visitStep = async (
      node: AnyStep,
      argsPending: Promise<unknown[]>,
    ): Promise<unknown> => {
      const result = await node.resolve(...await argsPending)(finalEnv);
      if (result instanceof Error) {
        throw result;
      }
      const nodeCleanup = node.cleanup;
      if (nodeCleanup) {
        // Horrible... clean this up with effect system refactor
        cleanup.push(async () => nodeCleanup(...await argsPending)(finalEnv)(result));
      }
      return result;
    };

    const visit = (node: unknown): Promise<unknown> => {
      if (node instanceof Z.HOEffect) {
        return visit(node.root);
      } else if (node instanceof Step) {
        // TODO: why is `args` not inferred as `unknown[]`?
        const argsPending = Promise.all((node as AnyStep).args.map((arg) => {
          return visit(arg);
        }));
        const prev = cache.get(node.signature);
        if (prev) {
          return prev;
        }
        const pending = visitStep(node, argsPending);
        cache.set(node.signature, pending);
        return pending;
      }
      return Promise.resolve(node);
    };

    try {
      const result = await visit(root);
      await Promise.all(cleanup.map((e) => e()));
      return result;
    } catch (e) {
      return e;
    }
  }) as Runtime<CommonR>;
}
