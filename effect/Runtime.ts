import * as Z from "/effect/Effect.ts";
import { NonIdempotent } from "/effect/intrinsic/NonIdempotent.ts";
import { AnyStep, Step } from "/effect/intrinsic/Step.ts";

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
      return result;
    };

    const visit = (
      node: unknown,
      idempotent = true,
    ): Promise<unknown> => {
      if (node instanceof Z.HOEffect) {
        return visit(node.root);
      } else if (node instanceof Step) {
        // TODO: why is `args` not inferred as `unknown[]`?
        const argsPending = Promise.all((node as AnyStep).args.map((arg) => {
          return visit(arg, idempotent);
        }));
        return visitStep(node, argsPending);
      } else if (node instanceof NonIdempotent) {
        return visit(node.root, false);
      }
      return Promise.resolve(node);
    };

    try {
      return await visit(root);
    } catch (e) {
      return e;
    }
  }) as Runtime<CommonR>;
}
