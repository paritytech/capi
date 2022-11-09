import { createTestPairs } from "../deps/polkadot/keyring.ts";
import { KeyringPair } from "../deps/polkadot/keyring/types.ts";
import { cryptoWaitReady } from "../deps/polkadot/util-crypto.ts";
import { ArrayOfLength } from "../util/mod.ts";

await cryptoWaitReady();

export interface Pairs {
  all: ArrayOfLength<KeyringPair, 6>;
  alice: KeyringPair;
  bob: KeyringPair;
  charlie: KeyringPair;
  dave: KeyringPair;
  eve: KeyringPair;
  ferdie: KeyringPair;
}

export const { all: users, alice, bob, charlie, dave, eve, ferdie } = pairs();
export function pairs(...args: Parameters<typeof createTestPairs>): Pairs {
  const raw = createTestPairs(...args);
  const alice = raw["alice"]!;
  const bob = raw["bob"]!;
  const charlie = raw["charlie"]!;
  const dave = raw["dave"]!;
  const eve = raw["eve"]!;
  const ferdie = raw["ferdie"]!;
  return {
    all: [alice, bob, charlie, dave, eve, ferdie],
    alice,
    bob,
    charlie,
    dave,
    eve,
    ferdie,
  };
}
