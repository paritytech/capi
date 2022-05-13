import { HOEffect, MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";

export type AnyPubKey = PubKeyFromText;

export class PubKeyFromText<Init extends MaybeEffectLike<string> = MaybeEffectLike<string>> extends HOEffect {
  root;

  constructor(readonly init: Init) {
    super();
    this.root = native([init], (init) => {
      return async () => {
        return new TextEncoder().encode(init);
      };
    });
  }
}

export const pubKeyFromText = <Init extends MaybeEffectLike<string>>(init: Init): PubKeyFromText<Init> => {
  return new PubKeyFromText(init);
};

// export class PubKeyFromSs58<Init extends Ss58Address = Ss58Address> extends HOEffect {}

// export const pubKeyFromSs58Text = <Init extends MaybeEffectLike<string>>(init: Init): PubKeyFromSs58<Init> => {
//   return new PubKeyFromSs58(init);
// };
