import { Args, resolveArgs } from "./args.ts"
import { Rune } from "./rune.ts"

class E1 extends Error {
  1 = 1
}
class E2 extends Error {
  2 = 2
}
class E3 extends Error {
  3 = 3
}
const e1 = Rune.resolve(new E1())
const e2 = Rune.resolve(new E2())
const e3 = Rune.resolve(new E3())
const e1n = Rune.resolve(new E1() as E1 | number)

const add = <X>(...[a, b]: Args<X, [a: number, b: number]>) => {
  return Rune.ls([a, b]).pipe(([a, b]) => a + b)
}

assertExact(add(1, 2), null! as Rune<number, never>)
assertExact(add(1, e1), null! as Rune<number, E1>)
assertExact(add(e1, 2), null! as Rune<number, E1>)
assertExact(add(e1, e2), null! as Rune<number, E1 | E2>)

// @ts-expect-error .
add()
// @ts-expect-error .
add(1, 2, 3)
// @ts-expect-error .
add("a", 1)
// @ts-expect-error .
add(1, "b")

const sum = <X>(...[...args]: Args<X, number[]>) => {
  return Rune.resolve(args.reduce(add, 0))
}

assertExact(sum(), null! as Rune<number, never>)
assertExact(sum(1, 2, 3), null! as Rune<number, never>)
assertExact(sum(e1, e2, e3, e2, e1), null! as Rune<number, E1 | E2 | E3>)

const box = <T, X>(...X: Args<X, [value: T]>) => {
  const [value] = resolveArgs(X)
  return value.pipe((value) => ({ value }))
}

const boxBox = <T, X>(...X: Args<X, [value: T]>) => {
  const [value] = resolveArgs(X)
  return box(box(value))
}

assertExact(box(0), null! as Rune<{ value: number }, never>)
assertExact(box(e1n), null! as Rune<{ value: number }, E1>)
assertExact(boxBox(0), null! as Rune<{ value: { value: number } }, never>)
assertExact(boxBox(e1n), null! as Rune<{ value: { value: number } }, E1>)

const boxEach = <T, X>(...X: Args<X, T[]>) => {
  return Rune.ls(resolveArgs(X).map((x) => box(x)))
}

assertExact(boxEach(1, 2, 3), null! as Rune<{ value: number }[], never>)
assertExact(boxEach(e1n, 2), null! as Rune<{ value: number }[], E1>)
assertExact(boxEach(e1, 2, e3, 4), null! as Rune<{ value: number }[], E1 | E3>)

const stringLiteral = <T extends string, X>(...X: Args<X, [T]>) => {
  return resolveArgs(X)[0]
}

assertExact(stringLiteral("a"), null! as Rune<"a", never>)

type IsEqual<X, Y, T, F> = (<T>() => T extends X ? 1 : 0) extends (<T>() => T extends Y ? 1 : 0) ? T
  : F

function assertExact<T, U>(
  _a: T,
  _b: IsEqual<T, U, U, never>,
) {}