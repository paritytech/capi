import { createTestPairs } from "../deps/polkadot/keyring.ts";

export const p = pairs();
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
