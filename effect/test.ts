import * as Z from "./mod.ts";

class RandE extends Error {}

interface RandR {
  rand(): number;
}

class Rand extends Z.Effect<RandR, RandE, number, []> {
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

export class AddE extends Error {}

export interface AddR {
  add(a: number, b: number): number;
}

export class Add<Values extends Z.AnyEffectA<number>[]> extends Z.Effect<AddR, AddE, number, Values> {
  values;
  constructor(...values: Values) {
    super(values, async (runtime, ...values) => {
      return values.reduce<number>((acc, cur) => {
        return runtime.add(acc, cur);
      }, 0);
    });
    this.values = values;
  }
}

export const add = <Values extends Z.AnyEffectA<number>[]>(...values: Values): Add<Values> => {
  return new Add(...values);
};

//

class DoubleE extends Error {}

interface DoubleR {
  double(n: number): number;
}

class Double<N extends Z.AnyEffectA<number>> extends Z.Effect<DoubleR, DoubleE, number, [N]> {
  constructor(readonly value: N) {
    super([value], async (runtime, resolved) => {
      return runtime.double(resolved);
    });
  }
}

export const double = <N extends Z.AnyEffectA<number>>(value: N): Double<N> => {
  return new Double(value);
};

//

class RandomlyThrowErr extends Error {}

class RandomlyThrow<A, E extends Z.AnyEffectA<A>> extends Z.Effect<{}, RandomlyThrowErr, A, [E]> {
  constructor(readonly effect: E) {
    super([effect], async (_, e) => {
      if (Math.random() > .5) {
        throw new RandomlyThrowErr();
      }
      return e;
    });
  }
}

export const randomlyThrow = <A, E extends Z.AnyEffectA<A>>(effect: E): RandomlyThrow<A, E> => {
  return new RandomlyThrow(effect);
};

//

const a = rand();
const b = double(a);
const c = add(a, b);
const d = randomlyThrow(c);

// console.log(c.toString());

const e = Z.exec(d);

const result = await e.run({
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
