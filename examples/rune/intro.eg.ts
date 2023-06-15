/**
 * @title Rune Intro
 * @stability nearing
 * @description Runes are our units of composition in Capi. A Rune can be thought of
 * as an interaction *component*. It is a lazy description of our data requirements.
 * Runes can model storage retrievals, conditional transaction pipelines and more.
 */

import { assertEquals } from "asserts"
import { Rune, RunicArgs, Scope } from "capi"

const scope = new Scope()

/// Lift a constant value into a Rune.
const value = Rune.constant(3)

/// Map over `value` and multiply it by itself. Then, run it.
const a = await value.map((value) => value * value).run(scope)

/// Ensure `a` is as expected.
console.log("a:", a)
assertEquals(a, 9)

/// Now lets create a Rune factory (a function that accepts a given
/// runic value(s) and produces a new Rune). If this looks a bit
/// strange, there's a good reason (which we'll cover in [u_track](./u_track)).
function exp<X>(...[n]: RunicArgs<X, [n: number]>) {
  return Rune.resolve(n).map((n) => n * n)
}

/// Utilize the `exp` factory and run the resulting Rune. Note we can
/// supply either a resolved value `3` or another Rune, which resolves
/// to the factory's parameter type.
const b = await exp(3).run(scope)
console.log("b:", b)
assertEquals(b, 9)
const c = await exp(value).run(scope)
console.log("c:", c)
assertEquals(c, 9)
