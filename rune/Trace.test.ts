import { assertEquals } from "../deps/std/testing/asserts.ts"
import { Trace } from "./Trace.ts"

function makeWrapped<A extends unknown[], T>(name: string, fn: (...args: A) => T) {
  const trace = new Trace(name)
  return (...args: A) => {
    return trace.run(() => fn(...args))
  }
}

function fooInner() {
  throw new Error("wat")
}

function makeFoo() {
  return makeWrapped("foo", () => {
    fooInner()
  })
}

Deno.test("trace", () => {
  const foo = makeFoo()

  try {
    foo()
    throw new Error("expected foo to throw")
  } catch (e) {
    assertEquals(
      (e as Error).stack?.split(import.meta.url).join(".../Trace.test.ts").replace(
        /\n^.*ext:cli.*$/gm,
        "",
      ),
      `
Error: wat
    at fooInner (.../Trace.test.ts:12:9)
    at .../Trace.test.ts:17:5
    at .../Trace.test.ts:7:28
    from foo
        at makeWrapped (.../Trace.test.ts:5:17)
        at makeFoo (.../Trace.test.ts:16:10)
        at .../Trace.test.ts:22:15
    `.trim(),
    )
  }
})
