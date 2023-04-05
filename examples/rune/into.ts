import { assertEquals } from "asserts"
import { Rune, RunicArgs } from "capi"

class MyRune<U> extends Rune<number, U> {
  add<X>(...[n]: RunicArgs<X, [n: number]>) {
    return Rune.tuple([this, n]).map(([a, b]) => a + b)
  }
}

const myRune = Rune.constant(46).into(MyRune)

const result0 = await myRune.add(100).run()
assertEquals(result0, 146)

class MyRuneWithArgs<U> extends Rune<number, U> {
  constructor(_prime: MyRuneWithArgs<U>["_prime"], readonly arg: number) {
    super(_prime)
  }

  added() {
    return Rune.tuple([this, this.arg]).map(([a, b]) => a + b)
  }
}

const myRuneWithArgs = Rune.constant(46).into(MyRuneWithArgs, 100)

const result1 = await myRuneWithArgs.added().run()
assertEquals(result1, 146)
