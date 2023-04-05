import { assertEquals } from "asserts"
import { Rune, RunicArgs } from "capi"

const value = Rune.constant(3)

const a = await value.map((value) => value * value).run()
assertEquals(a, 9)

function exp<X>(...[n]: RunicArgs<X, [n: number]>) {
  return Rune.resolve(n).map((n) => n * n)
}

const b = await exp(3).run()
assertEquals(b, 9)
const c = await exp(value).run()
assertEquals(c, 9)
