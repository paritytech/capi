import { createTestPairs } from "../deps/polkadot/keyring.ts";
import { KeyringPair } from "../deps/polkadot/keyring/types.ts";
import { cryptoWaitReady } from "../deps/polkadot/util-crypto.ts";
import { ArrayOfLength } from "../util/mod.ts";

await cryptoWaitReady();

export interface Pairs {
  all: ArrayOfLength<KeyringPair, 8>;
  alice: KeyringPair;
  bob: KeyringPair;
  charlie: KeyringPair;
  dave: KeyringPair;
  eve: KeyringPair;
  ferdie: KeyringPair;
  one: KeyringPair;
  two: KeyringPair;
}

export const { all: users, alice, bob, charlie, dave, eve, ferdie, one, two } = pairs();
export function pairs(...args: Parameters<typeof createTestPairs>): Pairs {
  const raw = createTestPairs(...args);
  const alice = raw["alice"]!;
  const bob = raw["bob"]!;
  const charlie = raw["charlie"]!;
  const dave = raw["dave"]!;
  const eve = raw["eve"]!;
  const ferdie = raw["ferdie"]!;
  const one = raw["one"]!;
  const two = raw["two"]!;
  return {
    all: [alice, bob, charlie, dave, eve, ferdie, one, two],
    alice,
    bob,
    charlie,
    dave,
    eve,
    ferdie,
    one,
    two,
  };
}
