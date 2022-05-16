import { HOEffect, MaybeEffectLike } from "/effect/Effect.ts";
import { step } from "/effect/intrinsic/Step.ts";

export abstract class Ss58<Init = any> extends HOEffect {
  constructor(readonly init: Init) {
    super();
  }
}

export class Ss58FromText<Init extends MaybeEffectLike<string>> extends Ss58<Init> {
  root;

  constructor(init: Init) {
    super(init);
    this.root = step([init], (init) => {
      return async () => {
        // TODO: return byte representation instead
        return init;
      };
    });
  }
}

export function ss58FromText<Init extends MaybeEffectLike<string>>(init: Init): Ss58FromText<Init> {
  return new Ss58FromText(init);
}
