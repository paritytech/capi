/**
 * @title Rune Subclassing
 * @stability nearing
 * @description Define a subclass (set of type-specific utilities), from which
 * any compatibly-typed Rune can adopt the subclass-defined fluent API.
 * @test_skip
 */

import { assertEquals } from "asserts"
import { Rune, RunicArgs } from "capi"

// The following is a Rune of `number`.
const num = Rune.constant(46)

// We can define a Rune subclass, which implements methods that
// act on the specified `T` (in this case `number`) of a given Rune.
// We'll implement a simple `add` method, which sums its resolved `T`
// and the supplied `n`.
class MyNumRune<U> extends Rune<number, U> {
  add<X>(...[n]: RunicArgs<X, [n: number]>) {
    return Rune.tuple([this, n]).map(([a, b]) => a + b)
  }
}

// Use `into` to get an instance of `MyNumRune`, bound to `num`.
const myNum = num.into(MyNumRune)

// This allows us to operate on `num` with the `MyNumRune`-defined fluent API.
const result0 = await myNum.add(100).run()

// Ensure that `result0` is equal to 146.
console.log(result0)
assertEquals(result0, 146)

// Let's do the same thing. This time, we'll accept an argument `arg`. Within
// the subclass-defined method, we can make reference to `this.`
class MyRuneWithArgs<U> extends Rune<number, U> {
  constructor(_prime: MyRuneWithArgs<U>["_prime"], readonly arg: number) {
    super(_prime)
  }

  added() {
    return Rune.tuple([this, this.arg]).map(([a, b]) => a + b)
  }
}

// When we call `into`, we must also apply a number to our `arg` parameter.
const myNumWithArgs = num.into(MyRuneWithArgs, 100)

// Ensure that `result1` is equal to 146.
const result1 = await myNumWithArgs.added().run()
console.log(result1)
assertEquals(result1, 146)
