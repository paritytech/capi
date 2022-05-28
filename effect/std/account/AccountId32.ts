import { effector } from "/effect/Effect.ts";

// TODO: ???
interface AccountId32 {
  0: number[];
}

export const accountId32FromPubKey = effector.sync("accountId32FromPubKey", () =>
  (init: Uint8Array): AccountId32 => {
    return { 0: [...init] };
  });
