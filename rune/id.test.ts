import { assertEquals } from "../deps/std/testing/asserts.ts"
import { Id } from "./id.ts"

const a = {}
const b = {}
const foo = (...x: unknown[]) => Id.hash(Id.loc``, ...x)
export const gens: Record<string, () => Id> = {
  loc0: () => Id.loc``,
  loc1: () => Id.loc``,
  v123: () => Id.value(123),
  v123n: () => Id.value(123n),
  vStr: () => Id.value("str"),
  vTrue: () => Id.value(true),
  vFalse: () => Id.value(false),
  vLoc: () => Id.value(Id.loc``),
  vObjLoc: () => Id.value({ id: Id.loc`` }),
  va: () => Id.value(a),
  vb: () => Id.value(b),
  foo: () => foo(),
  foo123: () => foo(123),
  fooA: () => foo(a),
  fooB: () => foo(b),
  fooAB: () => foo(a, b),
  fooStr1: () => foo("", "x"),
  fooStr2: () => foo("x", ""),
}

for (const a in gens) {
  for (const b in gens) {
    const shouldMatch = a === b
    Deno.test(`${a} ${shouldMatch ? "=" : "!"}== ${b}`, () => {
      assertEquals(gens[a]!() === gens[b]!(), shouldMatch)
    })
  }
}
