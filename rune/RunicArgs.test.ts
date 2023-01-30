import { Rune } from "./Rune.ts"
import { RunicArgs } from "./RunicArgs.ts"
import { ValueRune } from "./ValueRune.ts"

class E1 extends Error {
  1 = 1
}
class E2 extends Error {
  2 = 2
}
class E3 extends Error {
  3 = 3
}

const e1 = Rune.constant(new E1()).unwrapError()
const e2 = Rune.constant(new E2()).unwrapError()
const e3 = Rune.constant(new E3()).unwrapError()
const e1n = Rune.constant(new E1() as E1 | number).unwrapError()

const add = <X>(...[a, b]: RunicArgs<X, [a: number, b: number]>) => {
  return Rune.tuple([a, b]).map(([a, b]) => a + b)
}

assertExact(add(1, 2), null! as ValueRune<number, never>)
assertExact(add(1, e1), null! as ValueRune<number, E1>)
assertExact(add(e1, 2), null! as ValueRune<number, E1>)
assertExact(add(e1, e2), null! as ValueRune<number, E1 | E2>)

// @ts-expect-error .
add()
// @ts-expect-error .
add(1, 2, 3)
// @ts-expect-error .
add("a", 1)
// @ts-expect-error .
add(1, "b")

const sum = <X>(...[...args]: RunicArgs<X, number[]>) => {
  return Rune.resolve(args.reduce(add, 0))
}

assertExact(sum(), null! as ValueRune<number, never>)
assertExact(sum(1, 2, 3), null! as ValueRune<number, never>)
assertExact(sum(e1, e2, e3, e2, e1), null! as ValueRune<number, E1 | E2 | E3>)

const box = <T, X>(...X: RunicArgs<X, [value: T]>) => {
  const [value] = RunicArgs.resolve(X)
  return value.map((value) => ({ value }))
}

const boxBox = <T, X>(...X: RunicArgs<X, [value: T]>) => {
  const [value] = RunicArgs.resolve(X)
  return box(box(value))
}

assertExact(box(0), null! as ValueRune<{ value: number }, never>)
assertExact(box(e1n), null! as ValueRune<{ value: number }, E1>)
assertExact(boxBox(0), null! as ValueRune<{ value: { value: number } }, never>)
assertExact(boxBox(e1n), null! as ValueRune<{ value: { value: number } }, E1>)

const boxEach = <T, X>(...X: RunicArgs<X, T[]>) => {
  return Rune.tuple(RunicArgs.resolve(X).map((x) => box(x)))
}

assertExact(boxEach(1, 2, 3), null! as ValueRune<{ value: number }[], never>)
assertExact(boxEach(e1n, 2), null! as ValueRune<{ value: number }[], E1>)
assertExact(boxEach(e1n, 2, e3, 4), null! as ValueRune<{ value: number }[], E1 | E3>)

const stringLiteral = <T extends string, X>(...X: RunicArgs<X, [T]>) => {
  return RunicArgs.resolve(X)[0]
}

assertExact(stringLiteral("a"), null! as ValueRune<"a", never>)

type IsEqual<X, Y, T, F> = (<T>() => T extends X ? 1 : 0) extends (<T>() => T extends Y ? 1 : 0) ? T
  : F

function assertExact<T, U>(
  _a: T,
  _b: IsEqual<T, U, U, never>,
) {}
