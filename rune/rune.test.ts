import { assertEquals } from "../deps/std/testing/asserts.ts"
import { Clock } from "../util/clock.ts"
import { Args } from "./args.ts"
import { Rune } from "./rune.ts"

Deno.test("constant", async () => {
  assertEquals(
    await Rune
      .constant(123)
      .run(),
    123,
  )
})

Deno.test("pipe", async () => {
  assertEquals(
    await Rune
      .constant(1)
      .pipe((x) => x + 1)
      .run(),
    2,
  )
  assertEquals(
    await Rune
      .constant(new Error())
      .pipe(() => 123)
      .run(),
    new Error(),
  )
})

Deno.test("ls", async () => {
  assertEquals(await Rune.ls([1, 2]).run(), [1, 2])
})

const count = Rune.stream(() => iter(1, 2, 3))

Deno.test("stream", async () => {
  assertEquals(await count.run(), 1)
  // assertEquals(await collect(count.watch()), [1, 2, 3])
  // assertEquals(await collect(count.pipe((x) => x + "").watch()), ["1", "2", "3"])
})

const add = <X>(...[a, b]: Args<X, [a: number, b: number]>) => {
  return Rune.ls([a, b]).pipe(([a, b]) => a + b)
}

const sum = <X>(...[...args]: Args<X, number[]>) => {
  return Rune.resolve(args.reduce(add, 0))
}

Deno.test("add", async () => {
  assertEquals(await add(1, 2).run(), 3)
  assertEquals(
    await add(1, Rune.constant(new Error())).run(),
    new Error(),
  )
  assertEquals(
    await add(count, 10).run(),
    11,
  )
  // assertEquals(
  //   await collect(add(count, 10).watch()),
  //   [11, 12, 13],
  // )
  // assertEquals(
  //   await collect(add(count, count.pipe((x) => x * 10)).watch()),
  //   [11, 22, 33],
  // )
})

Deno.test("sum", async () => {
  assertEquals(await sum(1, 2, 3, 4, 5).run(), 15)
  assertEquals(await sum(count, count, count, count).run(), 4)
  // assertEquals(await collect(sum(count, count, count, count).watch()), [4, 8, 12])
})

const divide = <X>(
  { numerator, denominator }: Args<X, { numerator: number; denominator: number }>,
) => {
  return Rune.ls([numerator, denominator]).pipe(
    ([numerator, denominator]) => numerator / denominator,
  )
}

Deno.test("divide", async () => {
  assertEquals(await divide({ numerator: 3, denominator: 2 }).run(), 1.5)
})

Deno.test("multi stream", async () => {
  const clock = new Clock()
  const x = Rune.stream(async function*() {
    await clock.tick(1)
    yield 1
    await clock.tick(2)
    yield 2
    await clock.tick(5)
    yield 3
    await clock.tick(8)
    yield 4
  })
  const y = Rune.stream(async function*() {
    await clock.tick(3)
    yield 10
    await clock.tick(4)
    yield 20
    await clock.tick(6)
    yield 30
    await clock.tick(7)
    yield 40
  })
  const z = add(x, y)
  // t: [  0  ]--[  1  ]--[  2  ]--[  3  ]--[  4  ]--[  5  ]--[  6  ]--[  7  ]--[  8  ]
  // x:  *            1    *   2                      *   3                      *   4
  // y:  *                             10    *  20             *  30    *  40
  // z:  *                 *        11 12    *  22    *  23    *  33    *  43    *  44
  // assertEquals(await collect(z.watch()), [11, 12, 22, 23, 33, 43, 44])
  // clock.reset()
})

Deno.test("multi stream 2", async () => {
  const clock = new Clock()
  const a = Rune.stream(async function*() {
    await clock.tick(1)
    yield 1
    await clock.tick(3)
    yield 2
  })
  const A = a.pipe(async (value) => {
    await clock.tick(clock.time + 3)
    return value
  })
  const b = Rune.stream(async function*() {
    await clock.tick(2)
    yield 10
    await clock.tick(5)
    yield 20
    await clock.tick(8)
    yield 30
  })
  const c = add(a, b)
  const C = add(A, b)
  // t: [  0  ]--[  1  ]--[  2  ]--[  3  ]--[  4  ]--[  5  ]--[  6  ]--[  7  ]--[  8  ]
  // a:  *            1             *   2
  // A:  *                          *            1                          2
  // b:  *                    10                      *  20                      *  30
  // c:  *                    11    *  12             *  22                      *  32
  // C:  *                          *           11    *                 12 22       32
  // assertEquals(await collect(c.watch()), [11, 12, 22, 32])
  // clock.reset()
  // assertEquals(await collect(C.watch()), [11, 12, 22, 32])
  // clock.reset()
})

async function collect<T>(iter: AsyncIterable<T>) {
  const values = []
  for await (const value of iter) {
    // console.log(value)
    values.push(value)
  }
  return values
}

async function* iter<T>(...values: T[]) {
  for (const value of values) {
    yield value
  }
}
