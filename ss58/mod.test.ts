import { assertEquals, assertThrows } from "../deps/std/testing/asserts.ts";
import * as t from "../test-util/mod.ts";

import {
  decode,
  decodeRaw,
  encode,
  InvalidAddressChecksumError,
  InvalidAddressLengthError,
  InvalidNetworkPrefixError,
  InvalidPublicKeyLengthError,
} from "./mod.ts";

for (
  const [networkName, address, [prefix, publicKey]] of [
    [
      "polkadot",
      "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
      [0, t.alice.publicKey],
    ],
    [
      "substrate",
      "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      [42, t.alice.publicKey],
    ],
    [
      "aventus",
      "cLxkfNUiCYsb57YLhTJdNVKxUTB1VTpeygYZNhYuFc83KrFy7",
      [65, t.alice.publicKey],
    ],
  ] as const
) {
  Deno.test(`ss58.encode ${networkName}`, () => {
    const actual = encode(prefix, publicKey);
    assertEquals(actual, address);
  });
  Deno.test(`ss58.decode ${networkName}`, () => {
    const actual = decode(address);
    assertEquals(actual, [prefix, publicKey]);
  });
}

Deno.test("ss58.encode invalid public key length", () => {
  assertThrows(() => encode(0, t.alice.publicKey.slice(0, 30)), InvalidPublicKeyLengthError);
});

Deno.test("ss58.encode invalid network prefix", () => {
  assertThrows(() => encode(46, t.alice.publicKey, [0]), InvalidNetworkPrefixError);
});

Deno.test("ss58.decodeRaw long address", () => {
  assertThrows(() => decodeRaw(new Uint8Array(40)), InvalidAddressLengthError);
});

Deno.test("ss58.decodeRaw short address", () => {
  assertThrows(() => decodeRaw(new Uint8Array(30)), InvalidAddressLengthError);
});

Deno.test("ss58.decodeRaw invalid checksum", () => {
  assertThrows(
    () => decodeRaw(Uint8Array.of(0, ...t.alice.publicKey, 255, 255)),
    InvalidAddressChecksumError,
  );
});
