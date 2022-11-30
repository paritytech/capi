import { assertEquals } from "../deps/std/testing/asserts.ts"
import { Args } from "./args.ts"
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

Deno.test("pipe", async () => {
  assertEquals(
    await Future
      .constant(1)
      .pipe(Id.loc``, (x) => x + 1)
      .run(),
    2,
  )
  assertEquals(
    await Future
      .constant(new Error())
      .pipe(Id.loc``, () => 123)
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
      .pipe(Id.loc``, (x) => x + "")
      .collect()
      .run(),
    ["1", "2", "3"],
  )
})

const add = <X>(...[a, b]: Args<X, [a: number, b: number]>) => {
  return Future.ls([a, b]).pipe(Id.loc``, ([a, b]) => a + b)
}

const sum = <X>(...[...args]: Args<X, number[]>) => {
  return Future.resolve(args.reduce(add, 0))
}

Deno.test("add", async () => {
  assertEquals(await add(1, 2).run(), 3)
  assertEquals(
    await add(1, Future.constant(new Error())).run(),
    new Error(),
  )
  assertEquals(
    await add(Future.constant([1, 2, 3]).iter(), 10).run(),
    13,
  )
  assertEquals(
    await add(Future.constant([1, 2, 3]).iter().throttle(), 10).collect().run(),
    [11, 12, 13],
  )
  const x = Future.constant([1, 2, 3]).iter().throttle(10)
  assertEquals(
    await add(x, x.pipe(Id.loc``, (x) => x * 10)).debounce().collect().run(),
    [11, 22, 33],
  )
})

Deno.test("sum", async () => {
  const base = sum(1, 2, Future.constant([3, new Error(), 1003]).iter().throttle(), 4, 5)
  assertEquals(await base.run(), 15)
  assertEquals(await base.skip(1).run(), new Error())
  assertEquals(await base.skip(2).run(), 1015)
})

const divide = <X>(
  { numerator, denominator }: Args<X, { numerator: number; denominator: number }>,
) => {
  return Future.ls([numerator, denominator]).pipe(
    Id.loc``,
    ([numerator, denominator]) => numerator / denominator,
  )
}

Deno.test("divide", async () => {
  assertEquals(await divide({ numerator: 3, denominator: 2 }).run(), 1.5)
  // @ts-expect-error extra prop
  divide({ numerator: 1, denominator: 1, x: 0 })
})

const delay = <T>(time: number, value: T) => new Promise((r) => setTimeout(r, time, value))

Deno.test("delay", async () => {
  assertEquals(
    await Future
      .constant([1, 2, 3])
      .iter()
      .pipe(Id.loc``, (x) => delay(1000, x))
      .collect()
      .run(),
    [1, 2, 3],
  )
})
