import * as base58 from "../deps/std/encoding/base58.ts";
import { assertEquals, assertThrows } from "../deps/std/testing/asserts.ts";
import * as p from "../test-util/pairs.ts";

import { decode, encode } from "./mod.ts";

[
  {
    name: "ss58.encode should encode 8-bit prefix polkadot address",
    args: [0, p.alice.publicKey],
    expected: "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
  },
  {
    name: "ss58.encode should encode 8-bit prefix substrate address",
    args: [42, p.alice.publicKey],
    expected: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  },
  {
    name: "ss58.encode should encode 16-bit prefix aventus address",
    args: [65, p.alice.publicKey],
    expected: "cLxkfNUiCYsb57YLhTJdNVKxUTB1VTpeygYZNhYuFc83KrFy7", // cspell:disable-line
  },
].forEach(({ name, args, expected }) => {
  Deno.test({
    name,
    fn: () => {
      // @ts-ignore
      const actual = encode(...args);
      assertEquals(base58.encode(actual), expected);
    },
  });
});

[
  {
    name: "ss58.encode should throw for an invalid public key length",
    args: [0, p.alice.publicKey.slice(0, 30)],
    errorMessage: "Invalid public key length",
  },
  {
    name: "ss58.encode should throw for a reserved network prefix",
    args: [46, p.alice.publicKey],
    errorMessage: "Invalid network prefix",
  },
  {
    name: "ss58.encode should throw for an invalid network prefix",
    args: [0b0000_1111_1111_1111, p.alice.publicKey],
    errorMessage: "Invalid network prefix",
  },
].forEach(({ name, args, errorMessage }) => {
  Deno.test({
    name,
    fn: () => {
      // @ts-ignore
      assertThrows(() => encode(...args), Error, errorMessage);
    },
  });
});

[
  {
    name: "ss58.decode should decode 8-bit prefix polkadot address",
    args: ["15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5"],
    expected: [0, p.alice.publicKey],
  },
  {
    name: "ss58.decode should decode 8-bit prefix substrate address",
    args: ["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"],
    expected: [42, p.alice.publicKey],
  },
  {
    name: "ss58.decode should decode 16-bit prefix aventus address",
    args: ["cLxkfNUiCYsb57YLhTJdNVKxUTB1VTpeygYZNhYuFc83KrFy7"], // cspell:disable-line
    expected: [65, p.alice.publicKey],
  },
].forEach(({ name, args, expected }) => {
  Deno.test({
    name,
    fn: () => {
      // @ts-ignore
      const actual = decode(base58.decode(args[0]));
      assertEquals(actual, expected);
    },
  });
});

[
  {
    name: "ss58.decode should throw for a long address",
    args: ["15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5" + "11111111"],
    errorMessage: "Invalid address length",
  },
  {
    name: "ss58.decode should throw for a short address",
    args: ["15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5".slice(0, 40)],
    errorMessage: "Invalid address length",
  },
  {
    name: "ss58.decode should throw for an invalid checksum",
    // Alice public key with a 0xff 0xff checksum
    args: ["15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6ccE"],
    errorMessage: "Invalid address checksum",
  },
].forEach(({ name, args, errorMessage }) => {
  Deno.test({
    name,
    fn: () => {
      // @ts-ignore
      assertThrows(() => decode(...args), Error, errorMessage);
    },
  });
});
