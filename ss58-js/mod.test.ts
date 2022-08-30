import { assertEquals, assertThrows } from "../deps/std/testing/asserts.ts";
import { decode, encode } from "./mod.ts";

const ALICE_PUBLIC_KEY = "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d";

[
  {
    name: "ss58.encode should encode 8-bit prefix polkadot address",
    args: [0, ALICE_PUBLIC_KEY],
    expected: "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
  },
  {
    name: "ss58.encode should encode 8-bit prefix substrate address",
    args: [42, ALICE_PUBLIC_KEY],
    expected: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  },
  {
    name: "ss58.encode should encode 16-bit prefix aventus address",
    args: [65, ALICE_PUBLIC_KEY],
    expected: "cLxkfNUiCYsb57YLhTJdNVKxUTB1VTpeygYZNhYuFc83KrFy7",
  },
].forEach(({ name, args, expected }) => {
  Deno.test({
    name,
    fn: () => {
      // @ts-ignore
      const actual = encode(...args);
      assertEquals(actual, expected);
    },
  });
});

[
  {
    name: "ss58.encode should throw for an invalid public key length",
    args: [0, ALICE_PUBLIC_KEY.slice(0, 30)],
    errorMessage: "Invalid public key length",
  },
  {
    name: "ss58.encode should throw for a reserved network prefix",
    args: [46, ALICE_PUBLIC_KEY],
    errorMessage: "Invalid network prefix",
  },
  {
    name: "ss58.encode should throw for an invalid network prefix",
    args: [0b0000_1111_1111_1111, ALICE_PUBLIC_KEY],
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
    expected: [0, ALICE_PUBLIC_KEY],
  },
  {
    name: "ss58.decode should decode 8-bit prefix substrate address",
    args: ["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"],
    expected: [42, ALICE_PUBLIC_KEY],
  },
  {
    name: "ss58.decode should decode 16-bit prefix aventus address",
    args: ["cLxkfNUiCYsb57YLhTJdNVKxUTB1VTpeygYZNhYuFc83KrFy7"],
    expected: [65, ALICE_PUBLIC_KEY],
  },
].forEach(({ name, args, expected }) => {
  Deno.test({
    name,
    fn: () => {
      // @ts-ignore
      const actual = decode(...args);
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
