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

(<[networkName: string, prefix: number, publicKey: Uint8Array, base58EncodedAddress: string][]> [
  [
    "Polkadot",
    0,
    p.alice.publicKey,
    "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
  ],
  [
    "Substrate",
    42,
    p.alice.publicKey,
    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  ],
  [
    "Aventus",
    65,
    p.alice.publicKey,
    "cLxkfNUiCYsb57YLhTJdNVKxUTB1VTpeygYZNhYuFc83KrFy7", // cspell:disable-line
  ],
])
  .forEach(
    ([networkName, prefix, publicKey, base58EncodedAddress]) => {
      Deno.test({
        name: `ss58.encode should encode a ${networkName} address with ${prefix} prefix`,
        fn: () => {
          const actual = encode(prefix, publicKey);

          assertEquals(actual, base58.decode(base58EncodedAddress));
        },
      });
    },
  );

(<[
  testSpec: string,
  prefix: number,
  publicKey: Uint8Array,
  validNetworkPrefixes: number[] | undefined,
  ErrorClass: ErrorConstructor,
][]> [
  [
    "should throw for an invalid public key length",
    0,
    p.alice.publicKey.slice(0, 30),
    undefined,
    InvalidPublicKeyLengthError,
  ],
  [
    "should throw for an invalid network prefix",
    46,
    p.alice.publicKey,
    [0],
    InvalidNetworkPrefixError,
  ],
]).forEach(([testSpec, prefix, publicKey, validNetworkPrefixes, ErrorClass]) => {
  Deno.test({
    name: `ss58.encode ${testSpec}`,
    fn: () => {
      assertThrows(() => encode(prefix, publicKey, validNetworkPrefixes), ErrorClass);
    },
  });
});

(<[
  networkName: string,
  base58EncodedAddress: string,
  decodedAddress: [prefix: number, publicKey: Uint8Array],
][]> [
  [
    "Polkadot",
    "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
    [0, p.alice.publicKey],
  ],
  [
    "Substrate",
    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    [42, p.alice.publicKey],
  ],
  [
    "Aventus",
    "cLxkfNUiCYsb57YLhTJdNVKxUTB1VTpeygYZNhYuFc83KrFy7", // cspell:disable-line
    [65, p.alice.publicKey],
  ],
]).forEach(([networkName, base58EncodedAddress, [prefix, publicKey]]) => {
  Deno.test({
    name: `ss58.decode should decode a ${networkName} address`,
    fn: () => {
      const actual = decode(base58.decode(base58EncodedAddress));

      assertEquals(actual, [prefix, publicKey]);
    },
  });
});

(<[name: string, base58EncodedAddress: string, ErrorClass: ErrorConstructor][]> [
  [
    "should throw for a long address",
    "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5" + "11111111",
    InvalidAddressLengthError,
  ],
  [
    "should throw for a short address",
    "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5".slice(0, 40),
    InvalidAddressLengthError,
  ],
  [
    "should throw for an invalid checksum",
    // Alice public key with a 0xff 0xff checksum
    "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6ccE",
    InvalidAddressChecksumError,
  ],
]).forEach(([testSpec, base58EncodedAddress, ErrorClass]) => {
  Deno.test({
    name: `ss58.decode ${testSpec}`,
    fn: () => {
      assertThrows(() => decode(base58.decode(base58EncodedAddress)), ErrorClass);
    },
  });
});
