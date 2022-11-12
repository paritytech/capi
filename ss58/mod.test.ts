import { assertEquals, assertInstanceOf } from "../deps/std/testing/asserts.ts"
import * as T from "../test_util/mod.ts"
import * as ss58 from "./mod.ts"

for (
  const [networkName, address, [prefix, publicKey]] of [
    [
      "polkadot",
      "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
      [0, T.alice.publicKey],
    ],
    [
      "substrate",
      "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      [42, T.alice.publicKey],
    ],
    [
      "aventus",
      "cLxkfNUiCYsb57YLhTJdNVKxUTB1VTpeygYZNhYuFc83KrFy7",
      [65, T.alice.publicKey],
    ],
  ] as const
) {
  Deno.test(`ss58.encode ${networkName}`, () => {
    const actual = ss58.encode(prefix, publicKey)
    assertEquals(actual, address)
  })
  Deno.test(`ss58.decode ${networkName}`, () => {
    const actual = ss58.decode(address)
    assertEquals(actual, [prefix, publicKey])
  })
}

Deno.test("ss58.encode invalid public key length", () => {
  assertInstanceOf(
    ss58.encode(0, T.alice.publicKey.slice(0, 30)),
    ss58.InvalidPublicKeyLengthError,
  )
})

Deno.test("ss58.encode invalid network prefix", () => {
  assertInstanceOf(ss58.encode(46, T.alice.publicKey, [0]), ss58.InvalidNetworkPrefixError)
})

Deno.test("ss58.decodeRaw long address", () => {
  assertInstanceOf(ss58.decodeRaw(new Uint8Array(40)), ss58.InvalidAddressLengthError)
})

Deno.test("ss58.decodeRaw short address", () => {
  assertInstanceOf(ss58.decodeRaw(new Uint8Array(30)), ss58.InvalidAddressLengthError)
})

Deno.test("ss58.decodeRaw invalid checksum", () => {
  assertInstanceOf(
    ss58.decodeRaw(Uint8Array.of(0, ...T.alice.publicKey, 255, 255)),
    ss58.InvalidAddressChecksumError,
  )
})
