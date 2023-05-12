import { assertEquals } from "../deps/std/testing/asserts.ts"
import { compareBytes } from "./bytes.ts"

Deno.test("equals", () => {
  assertEquals(compareBytes(Uint8Array.of(1), Uint8Array.of(1)), 0)
})

Deno.test("less than", () => {
  assertEquals(compareBytes(Uint8Array.of(1, 0), Uint8Array.of(1, 1)), -1)
  assertEquals(compareBytes(Uint8Array.of(1, 0), Uint8Array.of(1, 1, 1, 1)), -1)
})

Deno.test("greater than", () => {
  assertEquals(compareBytes(Uint8Array.of(1, 1), Uint8Array.of(1, 0)), 1)
  assertEquals(compareBytes(Uint8Array.of(1, 1, 1, 1), Uint8Array.of(1, 0)), 1)
})
