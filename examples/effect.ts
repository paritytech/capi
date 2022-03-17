#!/usr/bin/env -S deno run -A --no-check=remote --import-map=import_map.json

import * as sys from "/system/mod.ts";

interface AddR {
  add(a: number, b: number): number;
}

const AddToThree = <Target extends sys.AnyEffectA<number>>(target: Target) => {
  return sys.effect<number, AddR>()(
    "AddToThree",
    { target },
    async (runtime, resolved) => {
      return sys.ok(runtime.add(resolved.target, 3));
    },
  );
};

interface RandRuntime {
  rand(): number;
}
class RandomIsGtPoint5 extends Error {
  readonly name = "is_gt_point_5";
}
const GetRand = () => {
  return sys.effect<number, RandRuntime>()(
    "GetRand",
    {},
    async (runtime, _) => {
      const x = runtime.rand();
      if (x > .5) {
        return new RandomIsGtPoint5();
      }
      return sys.ok(x);
    },
  );
};

const result = await sys.Fiber(AddToThree(GetRand()), new sys.WebSocketConnections(), {
  add(a, b) {
    return a + b;
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
