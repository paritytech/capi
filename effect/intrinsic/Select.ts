import { _E, _R, Effect, ExtractEffect, Resolved } from "/effect/Base.ts";

export class Select<
  Target,
  // TODO: effect-ify
  Key extends keyof Resolved<Target>,
> extends Effect<ExtractEffect<Target>[_R], ExtractEffect<Target>[_E], Resolved<Target>[Key]> {
  constructor(
    readonly target: Target,
    readonly key: Key,
  ) {
    super();
  }
}

export const select = <
  Target,
  // TODO: effect-ify
  Key extends keyof Resolved<Target>,
>(
  target: Target,
  key: Key,
): Select<Target, Key> => {
  return new Select(target, key);
};
