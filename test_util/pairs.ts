import { createTestPairs } from "../deps/polkadot/keyring.ts";
import { cryptoWaitReady } from "../deps/polkadot/util-crypto.ts";

await cryptoWaitReady();

export const { alice, bob, charlie, dave, eve, ferdie, one, two } = pairs();
export function pairs(...args: Parameters<typeof createTestPairs>) {
  const testPairs = createTestPairs(...args);
  return {
    alice: testPairs["alice"]!,
    bob: testPairs["bob"]!,
    charlie: testPairs["charlie"]!,
    dave: testPairs["dave"]!,
    eve: testPairs["eve"]!,
    ferdie: testPairs["ferdie"]!,
    one: testPairs["one"]!,
    two: testPairs["two"]!,
  };
}
