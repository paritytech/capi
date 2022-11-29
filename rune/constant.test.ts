import { assertEquals } from "../deps/std/testing/asserts.ts"
import { constant } from "./constant.ts"

Deno.test("constant", async () => {
  assertEquals(await constant(123).run(), 123)
})
