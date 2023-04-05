/**
 * @title Rune Intro
 * @stability nearing
 * @description Rune is our unit of composition in Capi. It can be thought of
 * as an interaction *component*. It is a lazy description of our data requirements.
 * Runes can model storage retrievals, conditional transaction pipelines and more.
 */

import { assertEquals } from "asserts"
import { Rune, RunicArgs } from "capi"

// Lift a constant value into a Rune.
const value = Rune.constant(3)

// Map over `value` and multiply it by itself. Then, run it.
const a = await value.map((value) => value * value).run()

// Ensure `a` is the expected number.
assertEquals(a, 9)

// Now lets create a Rune factory (a function that accepts a given
// runic value(s) and produces a new Rune). If this looks a bit
// strange, note this is because of type-level handling, in which
// any of the supplied arguments (which can be `T` or `Rune<T>`)
// might encapsulate error type information, which must be appropriately
// propagated to the factory-produced Rune.
function exp<X>(...[n]: RunicArgs<X, [n: number]>) {
  return Rune.resolve(n).map((n) => n * n)
}

// Utilize the `exp` factory and run the resulting Rune. Note we can
// supply either a resolved value `3` or another Rune, which resolves
// to the factory's parameter type.
const b = await exp(3).run()
assertEquals(b, 9)
const c = await exp(value).run()
assertEquals(c, 9)
