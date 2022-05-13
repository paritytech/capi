import { HOEffect, MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import { AnyPubKey } from "/effect/std/PubKey.ts";
import { AnySs58Address } from "/effect/std/Ss58Address.ts";

export class AccountId32FromPubKey<Init extends AnyPubKey> extends HOEffect {
  root;

  constructor(readonly init: Init) {
    super();
    this.root = native([init], (init) => {
      return async () => {
        return { 0: init };
      };
    });
  }
}

export const accountId32FromPubKey = <Init extends AnyPubKey>(init: Init): AccountId32FromPubKey<Init> => {
  return new AccountId32FromPubKey(init);
};

export class AccountId32FromSs58Addr<Init extends AnySs58Address> extends HOEffect {
  root;

  constructor(readonly init: Init) {
    super();
    this.root = native([init], (init) => {
      return async () => {
        return { 0: init };
      };
    });
  }
}

export const accountId32FromSs58Addr = <Init extends AnySs58Address>(init: Init): AccountId32FromSs58Addr<Init> => {
  return new AccountId32FromSs58Addr(init);
};
