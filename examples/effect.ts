#!/usr/bin/env -S deno run -A --no-check=remote --import-map=import_map.json

import * as sys from "/system/mod.ts";

const three = sys.lift(3 as const);
const four = sys.lift(4 as const);

interface AddR {
  add(a: number, b: number): number;
}

class ZeroError extends Error {}

const seven = sys.effect<number, AddR>()("Seven", { three, four }, async (runtime, resolved) => {
  const added = runtime.add(resolved.three, resolved.four);
  if (added === 0) {
    return new ZeroError();
  }
  return sys.ok(added);
});

interface RandR {
  rand(): number;
}

class GtPoint5Error extends Error {}

const rand = sys.effect<number, RandR>()("Rand", {}, async (runtime) => {
  const generated = runtime.rand();
  if (generated > .5) {
    return new GtPoint5Error();
  }
  return sys.ok(generated);
});

interface RMultiply {
  mul(a: number, b: number): number;
}

const multiply = <
  A extends sys.AnyEffectA<number>,
  B extends sys.AnyEffectA<number>,
>(
  a: A,
  b: B,
) => {
  return sys.effect<number, RMultiply>()("Multiply", { a, b }, async (runtime, resolved) => {
    return sys.ok(runtime.mul(resolved.a, resolved.b));
  });
};

const result = await sys.Fiber(multiply(seven, rand), {
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
