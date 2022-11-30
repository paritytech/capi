import { assertEquals } from "../deps/std/testing/asserts.ts"
import { Future } from "./future.ts"
import { Id } from "./id.ts"

Deno.test("constant", async () => {
  assertEquals(
    await Future
      .constant(123)
      .run(),
    123,
  )
})

Deno.test("mapValue", async () => {
  assertEquals(
    await Future
      .constant(1)
      .mapValue(Id.loc``, (x) => x + 1)
      .run(),
    2,
  )
  assertEquals(
    await Future
      .constant(new Error())
      .mapValue(Id.loc``, () => 123)
      .run(),
    new Error(),
  )
})

Deno.test("iter", async () => {
  assertEquals(
    await Future
      .constant([1, 2, 3])
      .iter()
      .run(),
    1,
  )
  assertEquals(
    await Future
      .constant([1, 2, 3])
      .iter()
      .skip(2)
      .run(),
    3,
  )
  assertEquals(
    await Future
      .constant([1, 2, 3])
      .iter()
      .mapValue(Id.loc``, (x) => x + "")
      .skip(1)
      .run(),
    "2",
  )
})
