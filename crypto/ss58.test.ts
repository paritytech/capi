import { assertEquals, assertThrows } from "../deps/std/testing/asserts.ts"
import * as ss58 from "./ss58.ts"
import { alice } from "./test_pairs.ts"

for (
  const [networkName, address, [prefix, payload, checksumLength]] of [
    [
      "polkadot",
      "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
      [0, alice.publicKey],
    ],
    [
      "substrate",
      "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      [42, alice.publicKey],
    ],
    [
      "aventus",
      "cLxkfNUiCYsb57YLhTJdNVKxUTB1VTpeygYZNhYuFc83KrFy7",
      [65, alice.publicKey],
    ],
    [
      "substrate 1 byte payload",
      "F7NZ",
      [42, Uint8Array.from([1])],
    ],
    [
      "substrate 2 byte payload",
      "25GpW4",
      [42, Uint8Array.from([1, 2])],
    ],
    [
      "substrate 2 byte payload + 2 byte checksum",
      // cspell:disable-next-line
      "5jrpfEX",
      [42, Uint8Array.from([1, 2]), 2],
    ],
    [
      "substrate 4 byte payload",
      "MvAtmUea",
      [42, Uint8Array.from([1, 2, 3, 4])],
    ],
    [
      "substrate 4 byte payload + 2 byte checksum",
      "2bKgfVK2sN",
      [42, Uint8Array.from([1, 2, 3, 4]), 2],
    ],
    [
      "substrate 4 byte payload + 3 byte checksum",
      "82VU4sxbFKh",
      [42, Uint8Array.from([1, 2, 3, 4]), 3],
    ],
    [
      "substrate 4 byte payload + 4 byte checksum",
      // cspell:disable-next-line
      "Y1aeU7vNADWR",
      [42, Uint8Array.from([1, 2, 3, 4]), 4],
    ],
    [
      "substrate 8 byte payload",
      "3MsZWNhRvzMGK9",
      [42, Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8])],
    ],
    [
      "substrate 8 byte payload + 2 byte checksum",
      "BR8AUemT3J8Sb7o",
      [42, Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]), 2],
    ],
    [
      "substrate 8 byte payload + 3 byte checksum",
      // cspell:disable-next-line
      "nyUcq3hBw8bqwazt",
      [42, Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]), 3],
    ],
    [
      "substrate 8 byte payload + 4 byte checksum",
      "4VvGu94tPFvYo1w4XE",
      [42, Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]), 4],
    ],
    [
      "substrate 8 byte payload + 5 byte checksum",
      "GSe9B8c9oEsML77cYU6",
      [42, Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]), 5],
    ],
    [
      "substrate 8 byte payload + 6 byte checksum",
      "2BAAw5ia9q6DEjKzBstZe",
      [42, Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]), 6],
    ],
    [
      "substrate 8 byte payload + 7 byte checksum",
      // cspell:disable-next-line
      "6BqUqhpVKyG11bpoR1cb8R",
      [42, Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]), 7],
    ],
    [
      "substrate 8 byte payload + 8 byte checksum",
      // cspell:disable-next-line
      "PtpysyAc2jKD3ehyryi5dkj",
      [42, Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]), 8],
    ],
    [
      "substrate 33 byte payload",
      "KVqMLDzVyHChtJ8imRTkP22Tuz8Yd7X9MABUhz1rHNpHny12V",
      [42, new Uint8Array(33)],
    ],
  ] as const
) {
  Deno.test(`ss58.encode ${networkName}`, () => {
    const actual = ss58.encode(prefix, payload, checksumLength)
    assertEquals(actual, address)
  })
  Deno.test(`ss58.decode ${networkName}`, () => {
    const actual = ss58.decode(address)
    assertEquals(actual, [prefix, payload])
  })
}

Deno.test("ss58.encode invalid payload length", () => {
  assertThrows(() => ss58.encode(0, alice.publicKey.slice(0, 30)), ss58.InvalidPayloadLengthError)
})

Deno.test("ss58.decodeRaw long address", () => {
  assertThrows(() => ss58.decodeRaw(new Uint8Array(40)), ss58.InvalidAddressLengthError)
})

Deno.test("ss58.decodeRaw short address", () => {
  assertThrows(() => ss58.decodeRaw(new Uint8Array(30)), ss58.InvalidAddressLengthError)
})

Deno.test("ss58.decodeRaw invalid checksum", () => {
  assertThrows(
    () => ss58.decodeRaw(Uint8Array.of(0, ...alice.publicKey, 255, 255)),
    ss58.InvalidAddressChecksumError,
  )
})
