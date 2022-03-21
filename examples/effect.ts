import * as u from "/_/util/mod.ts";
import * as s from "/system/mod.ts";

const three = s.lift(3 as const);
const four = s.lift(4 as const);

interface AddR {
  add(a: number, b: number): number;
}

class ZeroError extends Error {}

const seven = s.effect<number, AddR>()("Seven", { three, four }, async (runtime, resolved) => {
  const added = runtime.add(resolved.three, resolved.four);
  if (added === 0) {
    return new ZeroError();
  }
  return u.ok(added);
});

interface RandR {
  rand(): number;
}

class GtPoint5Error extends Error {}

const rand = s.effect<number, RandR>()("Rand", {}, async (runtime) => {
  const generated = runtime.rand();
  if (generated > .5) {
    return new GtPoint5Error();
  }
  return u.ok(generated);
});

interface RMultiply {
  mul(a: number, b: number): number;
}

const multiply = <
  A extends s.AnyEffectA<number>,
  B extends s.AnyEffectA<number>,
>(
  a: A,
  b: B,
) => {
  return s.effect<number, RMultiply>()("Multiply", { a, b }, async (runtime, resolved) => {
    return u.ok(runtime.mul(resolved.a, resolved.b));
  });
};

const fiber = new s.Fiber(multiply(seven, rand));
const result = await fiber.run({
  add(a, b) {
    return a + b;
  },
  mul(a, b) {
    return a * b;
  },
  rand() {
    return Math.random();
  },
});

if (result instanceof Error) {
  console.log({ err: result });
} else {
  console.log({ ok: result.value });
}
