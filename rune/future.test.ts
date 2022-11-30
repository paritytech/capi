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
      .collect()
      .run(),
    ["1", "2", "3"],
  )
})

const add = <AE extends Error, BE extends Error>(a: Future<number, AE>, b: Future<number, BE>) => {
  return Future.ls([a, b]).mapValue(Id.loc``, ([a, b]) => a + b)
}

Deno.test("add", async () => {
  assertEquals(
    await add(
      Future.constant(1),
      Future.constant(2),
    ).run(),
    3,
  )
  assertEquals(
    await add(
      Future.constant(1),
      Future.constant(new Error()),
    ).run(),
    new Error(),
  )
  assertEquals(
    await add(
      Future.constant([1, 2, 3]).iter(),
      Future.constant(10),
    ).run(),
    13,
  )
  assertEquals(
    await add(
      Future.constant([1, 2, 3]).iter().throttle(),
      Future.constant(10),
    ).collect().run(),
    [11, 12, 13],
  )
  assertEquals(
    await add(
      Future.constant([1, 2, 3]).iter().throttle(10),
      Future.constant([10, 20, 30]).iter().throttle(10),
    ).debounce().collect().run(),
    [11, 22, 33],
  )
})
