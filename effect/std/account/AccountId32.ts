import { effector } from "../../../effect/impl/mod.ts";

type AccountId32 = Uint8Array;

// TODO: remove?
export const accountId32FromPubKey = effector.sync(
  "accountId32FromPubKey",
  () =>
    (init: Uint8Array): AccountId32 => {
      return init;
    },
);
