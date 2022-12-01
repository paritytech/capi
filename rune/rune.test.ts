import { deferred } from "../deps/std/async.ts"
import { assertEquals } from "../deps/std/testing/asserts.ts"
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
  assertEquals(await collect(count.watch()), [1, 2, 3])
  assertEquals(await collect(count.pipe((x) => x + "").watch()), ["1", "2", "3"])
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
  const x = Rune.stream(async function*() {
    await clock.start()
    await clock.to(1)
    yield 1
    await clock.to(2)
    yield 2
    await clock.to(5)
    yield 3
    await clock.to(8)
    yield 4
    await clock.end()
  })
  const y = Rune.stream(async function*() {
    await clock.start()
    await clock.to(3)
    yield 10
    await clock.to(4)
    yield 20
    await clock.to(6)
    yield 30
    await clock.to(7)
    yield 40
    await clock.end()
  })
  const z = add(x, y)
  // t: [  0  ]--[  1  ]--[  2  ]--[  3  ]--[  4  ]--[  5  ]--[  6  ]--[  7  ]--[  8  ]
  // x:  *            1    *   2                      *   3                      *   4
  // y:  *                             10    *  20             *  30    *  40
  // z:  *                 *        11 12    *  22    *  23    *  33    *  43    *  44
  assertEquals(await collect(z.watch()), [11, 12, 22, 23, 33, 43, 44])
  clock.reset()
})

Deno.test("multi stream 2", async () => {
  const clock = new Clock()
  const a = Rune.stream(async function*() {
    await clock.start()
    await clock.to(1)
    yield 1
    await clock.to(3)
    yield 2
    await clock.end()
  })
  const A = a.pipe(async (value) => {
    await clock.start()
    await clock.to(clock.time + 3)
    await clock.end()
    return value
  })
  const b = Rune.stream(async function*() {
    await clock.start()
    await clock.to(2)
    yield 10
    await clock.to(5)
    yield 20
    await clock.to(8)
    yield 30
    await clock.end()
  })
  const c = add(a, b)
  const C = add(A, b)
  // t: [  0  ]--[  1  ]--[  2  ]--[  3  ]--[  4  ]--[  5  ]--[  6  ]--[  7  ]--[  8  ]
  // a:  *            1             *   2
  // A:  *                          *            1                          2
  // b:  *                    10                      *  20                      *  30
  // c:  *                    11    *  12             *  22                      *  32
  // C:  *                          *           11    *                 12 22       32
  assertEquals(await collect(c.watch()), [11, 12, 22, 32])
  await clock.reset()
  assertEquals(await collect(C.watch()), [11, 12, 22, 32])
  await clock.reset()
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

class Clock {
  time = 0
  running = 0
  waiting = 0
  next = deferred()
  scheduled = false

  async reset() {
    if (this.scheduled) await this.next
    assertEquals(this.running, 0)
    assertEquals(this.waiting, 0)
    this.time = 0
  }

  set(time: number) {
    this.time = time
    const old = this.next
    this.next = deferred()
    old.resolve()
  }

  async start() {
    this.running++
    // console.log("start", this.running)
  }

  async end() {
    this.running--
    // console.log("end", this.running)
    this.tryTick()
  }

  async to(time: number) {
    // console.log("to", time)
    while (this.time < time) {
      this.running--
      this.waiting++
      // console.log("waiting", this.waiting)
      this.tryTick()
      await this.next
      // console.log("woke up")
    }
    // console.log("will run", time)
  }

  tryTick() {
    // console.log("tryTick", this.running)
    if (this.running || this.scheduled) return
    // console.log("confirmed; scheduling")
    this.scheduled = true
    const old = this.next
    setTimeout(() => {
      this.scheduled = false
      if (this.running) {
        // console.log("abort tick", this.running)
        return
      }
      this.time++
      // console.log(`--- ${this.time} ---`)
      this.next = deferred()
      this.running = this.waiting
      this.waiting = 0
      // console.log(this.running, "to wake up")
      old.resolve()
    }, 0)
  }
}
