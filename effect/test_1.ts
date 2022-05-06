import { _A, AnyEffect, AnyResolvableA, Effect, exec, lift, then } from "./mod.ts";

class RandE extends Error {
  readonly name = "rand_e";
}

interface RandR {
  rand(): number;
}

class Rand extends Effect<RandR, RandE, number, []> {
  constructor() {
    super([], async (runtime) => {
      return runtime.rand();
    });
  }
}
export const rand = (): Rand => {
  return new Rand();
};

//

export class AddE extends Error {
  readonly name = "add_e";
}

export interface AddR {
  add(a: number, b: number): number;
}

export class Add<Values extends AnyResolvableA<number>[]> extends Effect<AddR, AddE, number, Values> {
  constructor(...values: Values) {
    super(values, async (runtime, ...values) => {
      return values.reduce<number>((acc, cur) => {
        return runtime.add(acc, cur);
      }, 0);
    });
  }
}

export const add = <Values extends AnyResolvableA<number>[]>(...values: Values): Add<Values> => {
  return new Add(...values);
};

//

class DoubleE extends Error {
  readonly name = "double_e";
}

interface DoubleR {
  double(n: number): number;
}

class Double<N extends AnyResolvableA<number>> extends Effect<DoubleR, DoubleE, number, [N]> {
  constructor(value: N) {
    super([value], async (runtime, resolved) => {
      return runtime.double(resolved);
    });
  }
}

export const double = <N extends AnyResolvableA<number>>(value: N): Double<N> => {
  return new Double(value);
};

//

class RandomlyThrowErr extends Error {
  readonly name = "randomly_throw_e";
}

class RandomlyThrow<E extends AnyEffect> extends Effect<{}, RandomlyThrowErr, E[_A], [E]> {
  constructor(effect: E) {
    super([effect], async (_, e) => {
      if (Math.random() > .5) {
        throw new RandomlyThrowErr();
      }
      return e;
    });
  }
}

export const randomlyThrow = <E extends AnyEffect>(effect: E): RandomlyThrow<E> => {
  return new RandomlyThrow(effect);
};

//

const a = rand();
const b = double(a);
const c = add(a, b, 50);
const d = then(c)((r) => {
  return r + 100;
});
const e = randomlyThrow(d);

const f = exec(e);

const result = await f.run({
  add(a, b) {
    return a + b;
  },
  double(n) {
    return n * 2;
  },
  rand() {
    return Math.random();
  },
});

console.log(result);
