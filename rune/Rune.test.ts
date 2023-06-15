import { assertEquals } from "../deps/std/testing/asserts.ts"
import { Clock } from "../util/clock.ts"
import { is, MetaRune, Rune, RunicArgs, Scope } from "./mod.ts"

Deno.test("constant", async () => {
  assertEquals(
    await Rune
      .constant(123)
      .run(new Scope()),
    123,
  )
})

Deno.test("pipe", async () => {
  assertEquals(
    await Rune
      .constant(1)
      .map((x) => x + 1)
      .run(new Scope()),
    2,
  )
  assertEquals(
    await Rune
      .constant(new Error())
      .unhandle(is(Error))
      .map(() => 123)
      .rehandle(is(Error), (x) => x)
      .run(new Scope()),
    new Error(),
  )
})

Deno.test("ls", async () => {
  assertEquals(await Rune.tuple([1, 2]).run(new Scope()), [1, 2])
})

const count = Rune.asyncIter(() => iter([1, 2, 3]))

Deno.test("stream", async () => {
  assertEquals(await count.run(new Scope()), 1)
  assertEquals(await _collect(count.iter(new Scope())), [1, 2, 3])
  assertEquals(await count.collect().run(new Scope()), [1, 2, 3])
  assertEquals(await count.map((x) => x + "").collect().run(new Scope()), ["1", "2", "3"])

  async function _collect<T>(iter: AsyncIterable<T>) {
    const values = []
    for await (const value of iter) {
      values.push(value)
    }
    return values
  }
})

const add = <X>(...[a, b]: RunicArgs<X, [a: number, b: number]>) => {
  return Rune.tuple([a, b]).map(([a, b]) => a + b)
}

const sum = <X>(...[...args]: RunicArgs<X, number[]>) => {
  return Rune.resolve(args.reduce(add, 0))
}

Deno.test("add", async () => {
  assertEquals(await add(1, 2).run(new Scope()), 3)
  assertEquals(
    await add(1, Rune.constant(new Error()).unhandle(is(Error)))
      .rehandle(is(Error), (x) => x).run(new Scope()),
    new Error(),
  )
  assertEquals(
    await add(count, 10).run(new Scope()),
    11,
  )
  assertEquals(
    await add(count, 10).collect().run(new Scope()),
    [11, 12, 13],
  )
  assertEquals(
    await add(count, count.map((x) => x * 10)).collect().run(new Scope()),
    [11, 22, 33],
  )
})

Deno.test("sum", async () => {
  assertEquals(await sum(1, 2, 3, 4, 5).run(new Scope()), 15)
  assertEquals(await sum(count, count, count, count).run(new Scope()), 4)
  assertEquals(await sum(count, count, count, count).collect().run(new Scope()), [4, 8, 12])
})

const divide = <X>(
  { numerator, denominator }: RunicArgs<X, { numerator: number; denominator: number }>,
) => {
  return Rune.tuple([numerator, denominator]).map(
    ([numerator, denominator]) => numerator / denominator,
  )
}

Deno.test("divide", async () => {
  assertEquals(await divide({ numerator: 3, denominator: 2 }).run(new Scope()), 1.5)
})

Deno.test("multi stream", async () => {
  const clock = new Clock()
  const a = Rune.asyncIter(async function*() {
    await clock.tick(1)
    yield 1
    await clock.tick(2)
    yield 2
    await clock.tick(5)
    yield 3
    await clock.tick(8)
    yield 4
  })
  const b = Rune.asyncIter(async function*() {
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
    await a.map((v) => [clock.time, v]).collect().run(new Scope()),
    [[1, 1], [2, 2], [5, 3], [8, 4]],
  )
  clock.reset()
  assertEquals(
    await b.map((v) => [clock.time, v]).collect().run(new Scope()),
    [[3, 10], [4, 20], [6, 30], [7, 40]],
  )
  clock.reset()
  assertEquals(
    await c.map((v) => [clock.time, v]).collect().run(new Scope()),
    [[3, 11], [3, 12], [4, 22], [5, 23], [6, 33], [7, 43], [8, 44]],
  )
  clock.reset()
  assertEquals(
    await d.map((v) => [clock.time, v]).collect().run(new Scope()),
    [[3, 11], [3, 12], [5, 23], [8, 44]],
  )
  clock.reset()
  assertEquals(
    await e.map((v) => [clock.time, v]).collect().run(new Scope()),
    [[3, 11], [4, 22], [6, 33], [7, 43]],
  )
  clock.reset()
})

Deno.test("multi stream 2", async () => {
  const clock = new Clock()
  const a = Rune.asyncIter(async function*() {
    await clock.tick(1)
    yield 1
    await clock.tick(3)
    yield 2
  })
  const b = a.map(async (value) => {
    await clock.tick(clock.time + 3)
    return value
  })
  const c = Rune.asyncIter(async function*() {
    await clock.tick(2)
    yield 10
    await clock.tick(5)
    yield 20
    await clock.tick(8)
    yield 30
  })
  const d = add(a, c)
  const e = add(b, c)
  const f = add(b, c.lazy())
  const g = add(b.lazy(), c)
  const h = add(b.lazy(), c.lazy())
  // t: [  0  ]--[  1  ]--[  2  ]--[  3  ]--[  4  ]--[  5  ]--[  6  ]--[  7  ]--[  8  ]
  // a:  *            1             *   2
  // b:  *                          *            1                          2
  // c:  *                    10                      *  20                      *  30
  // d:  *                    11    *  12             *  22                      *  32
  // e:  *                          *           11    *                 12 22    *  32
  // f:  *                          *           11                         12
  // g:  *                                      11    *                          22 32 (due to lazy, b is not triggered until 5, causing 2 to be pushed late at 8)
  // h:  *                                      11
  assertEquals(
    await d.map((v) => [clock.time, v]).collect().run(new Scope()),
    [[2, 11], [3, 12], [5, 22], [8, 32]],
  )
  clock.reset()
  assertEquals(await e.collect().run(new Scope()), [11, 12, 22, 32])
  clock.reset()
  assertEquals(
    await e.map((v) => [clock.time, v]).collect().run(new Scope()),
    [[4, 11], [7, 12], [7, 22], [8, 32]],
  )
  clock.reset()
  assertEquals(
    await f.map((v) => [clock.time, v]).collect().run(new Scope()),
    [[4, 11], [7, 12]],
  )
  clock.reset()
  assertEquals(
    await g.map((v) => [clock.time, v]).collect().run(new Scope()),
    [[4, 11], [8, 22], [8, 32]],
  )
  clock.reset()
  assertEquals(
    await h.map((v) => [clock.time, v]).collect().run(new Scope()),
    [[4, 11]],
  )
  clock.reset()
})

Deno.test("derived stream", async () => {
  const clock = new Clock()
  const a = Rune.asyncIter(async function*() {
    await clock.tick(1)
    yield 1
    await clock.tick(4)
    yield 2
    await clock.tick(7)
    yield 3
  })
  const b = a.map((value) =>
    Rune.asyncIter(async function*() {
      const time = clock.time
      await clock.tick(time + 1)
      yield value
      await clock.tick(time + 2)
      yield value
      await clock.tick(time + 4)
      yield value
    })
  ).into(MetaRune).flat()
  assertEquals(
    await b.map((v) => [clock.time, v]).collect().run(new Scope()),
    [[2, 1], [3, 1], [5, 2], [6, 2], [8, 3], [9, 3], [11, 3]],
  )
})

async function* iter<T>(values: T[]) {
  for (const value of values) {
    yield value
  }
}

Deno.test("match abc", async () => {
  for (
    const value of [
      { type: "a", a: 0 },
      { type: "b", b: "0" },
      { type: "c", c: false },
    ] as const
  ) {
    const result = await Rune.constant(value).match((_) =>
      _
        .when(is("a"), (x) => x.access("a"))
        .when(is("b"), (x) => x.access("b"))
        .else((x) => x.access("c"))
    ).run()
    assertEquals(+result, 0)
  }
})

Deno.test("match u", async () => {
  assertEquals(
    await Rune
      .constant("hello")
      .unhandle(is(String))
      .match((_) =>
        _.else((x) =>
          x
            .rehandle((_: never): _ is never => true)
            .map(() => {
              throw new Error("unreachable")
            })
        )
      )
      .rehandle(is(String))
      .run(),
    "hello",
  )
})
