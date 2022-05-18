import { AnyEffectLike, HOEffect } from "/effect/Effect.ts";
import { step } from "/effect/intrinsic/Step.ts";
import { PubKey } from "/effect/std/account/PubKey.ts";

export abstract class AccountId32<Init> extends HOEffect {
  abstract root: AnyEffectLike<{ 0: number[] }>;

  constructor(readonly init: Init) {
    super();
  }
}

export class AccountId32FromPubKey<Init extends PubKey> extends AccountId32<Init> {
  root;

  constructor(init: Init) {
    super(init);
    this.root = step("AccountId32FromPubKey", [init], (init) => {
      return async () => {
        return { 0: [...init] };
      };
    });
  }
}

export const accountId32FromPubKey = <Init extends PubKey>(init: Init): AccountId32FromPubKey<Init> => {
  return new AccountId32FromPubKey(init);
};
