import { effector } from "/effect/impl/mod.ts";

// TODO: ???
interface AccountId32 {
  0: number[];
}

export const accountId32FromPubKey = effector.sync(
  "accountId32FromPubKey",
  () =>
    (init: Uint8Array): AccountId32 => {
      return { 0: [...init] };
    },
);
