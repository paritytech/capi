import { assertEquals } from "../deps/std/testing/asserts.ts"
import { compare } from "./bytes.ts"

Deno.test("equals", () => {
  assertEquals(compare(Uint8Array.of(1), Uint8Array.of(1)), 0)
})

Deno.test("less than", () => {
  assertEquals(compare(Uint8Array.of(1, 0), Uint8Array.of(1, 1)), -1)
  assertEquals(compare(Uint8Array.of(1, 0), Uint8Array.of(1, 1, 1, 1)), -1)
})

Deno.test("greater than", () => {
  assertEquals(compare(Uint8Array.of(1, 1), Uint8Array.of(1, 0)), 1)
  assertEquals(compare(Uint8Array.of(1, 1, 1, 1), Uint8Array.of(1, 0)), 1)
})
