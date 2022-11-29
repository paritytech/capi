import { assertEquals } from "../deps/std/testing/asserts.ts"
import { Future } from "./future.ts"
import { Id } from "./id.ts"

Deno.test("constant", async () => {
  assertEquals(await Future.constant(123).run(), 123)
})

Deno.test("mapValue", async () => {
  assertEquals(await Future.constant(1).mapValue(Id.loc``, (x) => x + 1).run(), 2)
})
