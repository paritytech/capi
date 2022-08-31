import * as base58 from "../deps/std/encoding/base58.ts";
import { assertEquals, assertThrows } from "../deps/std/testing/asserts.ts";
import * as p from "../test-util/pairs.ts";

import {
  decode,
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
      [0, p.alice.publicKey],
    ],
    [
      "substrate",
      "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      [42, p.alice.publicKey],
    ],
    [
      "aventus",
      "cLxkfNUiCYsb57YLhTJdNVKxUTB1VTpeygYZNhYuFc83KrFy7", // cspell:disable-line
      [65, p.alice.publicKey],
    ],
  ] as const
) {
  Deno.test(`ss58.encode ${networkName}`, () => {
    const actual = base58.encode(encode(prefix, publicKey));
    assertEquals(actual, address);
  });
  Deno.test(`ss58.decode ${networkName}`, () => {
    const actual = decode(base58.decode(address));
    assertEquals(actual, [prefix, publicKey]);
  });
}

Deno.test("ss58.encode invalid public key length", () => {
  assertThrows(() => encode(0, p.alice.publicKey.slice(0, 30)), InvalidPublicKeyLengthError);
});

Deno.test("ss58.encode invalid network prefix", () => {
  assertThrows(() => encode(46, p.alice.publicKey, [0]), InvalidNetworkPrefixError);
});

Deno.test("ss58.decode long address", () => {
  assertThrows(() => decode(new Uint8Array(40)), InvalidAddressLengthError);
});

Deno.test("ss58.decode short address", () => {
  assertThrows(() => decode(new Uint8Array(30)), InvalidAddressLengthError);
});

Deno.test("ss58.decode invalid checksum", () => {
  assertThrows(
    () => decode(Uint8Array.of(0, ...p.alice.publicKey, 255, 255)),
    InvalidAddressChecksumError,
  );
});
