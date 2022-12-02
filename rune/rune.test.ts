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
      .unwrapError()
      .pipe(() => 123)
      .catch()
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
  assertEquals(await collect(count.watch()), [1, 2, 3])
  assertEquals(await collect(count.pipe((x) => x + "").watch()), ["1", "2", "3"])
  assertEquals(await collect(count.latest().watch()), [3])
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
    await add(1, Rune.constant(new Error()).unwrapError()).catch().run(),
    new Error(),
  )
  assertEquals(
    await add(count, 10).run(),
    11,
  )
  assertEquals(
    await collect(add(count, 10).watch()),
    [11, 12, 13],
  )
  assertEquals(
    await collect(add(count, count.pipe((x) => x * 10)).watch()),
    [11, 22, 33],
  )
})

Deno.test("sum", async () => {
  assertEquals(await sum(1, 2, 3, 4, 5).run(), 15)
  assertEquals(await sum(count, count, count, count).run(), 4)
  assertEquals(await collect(sum(count, count, count, count).watch()), [4, 8, 12])
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
  const a = Rune.stream(async function*() {
    await clock.tick(1)
    yield 1
    await clock.tick(2)
    yield 2
    await clock.tick(5)
    yield 3
    await clock.tick(8)
    yield 4
  })
  const b = Rune.stream(async function*() {
    await clock.tick(3)
    yield 10
    await clock.tick(4)
    yield 20
    await clock.tick(6)
    yield 30
    await clock.tick(7)
    yield 40
  })
  const c = add(a, b)
  const d = add(a, b.lazy())
  const e = add(a.lazy(), b)
  // t: [  0  ]--[  1  ]--[  2  ]--[  3  ]--[  4  ]--[  5  ]--[  6  ]--[  7  ]--[  8  ]
  // a:  *            1    *   2                      *   3                      *   4
  // b:  *                             10    *  20             *  30    *  40
  // c:  *                 *        11 12    *  22    *  23    *  33    *  43    *  44
  // d:  *                 *        11 12             *  23                      *  44
  // e:  *                             11    *  22             *  33    *  43
  assertEquals(
    await collect(c.pipe((v) => [clock.time, v]).watch()),
    [[3, 11], [3, 12], [4, 22], [5, 23], [6, 33], [7, 43], [8, 44]],
  )
  clock.reset()
  assertEquals(
    await collect(d.pipe((v) => [clock.time, v]).watch()),
    [[3, 11], [3, 12], [5, 23], [8, 44]],
  )
  clock.reset()
  assertEquals(
    await collect(e.pipe((v) => [clock.time, v]).watch()),
    [[3, 11], [4, 22], [6, 33], [7, 43]],
  )
  clock.reset()
})

Deno.test("multi stream 2", async () => {
  const clock = new Clock()
  const a = Rune.stream(async function*() {
    await clock.tick(1)
    yield 1
    await clock.tick(3)
    yield 2
  })
  const b = a.pipe(async (value) => {
    await clock.tick(clock.time + 3)
    return value
  })
  const c = Rune.stream(async function*() {
    await clock.tick(2)
    yield 10
    await clock.tick(5)
    yield 20
    await clock.tick(8)
    yield 30
  })
  const d = add(a, c)
  const e = add(b, c)
  const f = add(b, c.latest())
  const g = add(b.latest(), c)
  const h = add(b.latest(), c.latest())
  const i = add(b, c.lazy())
  const j = add(b.lazy(), c)
  const k = add(b.lazy(), c.lazy())
  // t: [  0  ]--[  1  ]--[  2  ]--[  3  ]--[  4  ]--[  5  ]--[  6  ]--[  7  ]--[  8  ]
  // a:  *            1             *   2
  // b:  *                          *            1                          2
  // c:  *                    10                      *  20                      *  30
  // d:  *                    11    *  12             *  22                      *  32
  // e:  *                          *           11    *                 12 22    *  32
  // f:  *                          *           11    *                  ! 22    *  32
  // g:  *                          *            !    *                 12 22    *  32
  // h:  *                          *            !    *                  !  !    *  32
  // i:  *                          *           11                         12
  // j:  *                                      11    *                          22 32 (due to lazy, b is not triggered until 5, causing 2 to be pushed late at 8)
  // k:  *                                      11
  assertEquals(
    await collect(d.pipe((v) => [clock.time, v]).watch()),
    [[2, 11], [3, 12], [5, 22], [8, 32]],
  )
  clock.reset()
  assertEquals(await collect(e.watch()), [11, 12, 22, 32])
  clock.reset()
  assertEquals(
    await collect(e.pipe((v) => [clock.time, v]).watch()),
    [[4, 11], [7, 12], [7, 22], [8, 32]],
  )
  clock.reset()
  assertEquals(
    await collect(f.pipe((v) => [clock.time, v]).watch()),
    [[4, 11], [8, 32]],
  )
  clock.reset()
  assertEquals(
    await collect(g.pipe((v) => [clock.time, v]).watch()),
    [[7, 12], [7, 22], [8, 32]],
  )
  clock.reset()
  assertEquals(
    await collect(h.pipe((v) => [clock.time, v]).watch()),
    [[8, 32]],
  )
  clock.reset()
  assertEquals(
    await collect(i.pipe((v) => [clock.time, v]).watch()),
    [[4, 11], [7, 12]],
  )
  clock.reset()
  assertEquals(
    await collect(j.pipe((v) => [clock.time, v]).watch()),
    [[4, 11], [8, 22], [8, 32]],
  )
  clock.reset()
  assertEquals(
    await collect(k.pipe((v) => [clock.time, v]).watch()),
    [[4, 11]],
  )
  clock.reset()
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
