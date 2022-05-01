import { _A, _E, _R, AnyEffect, AnyEffectA, Effect } from "./Base.ts";
import { exec } from "./Exec.ts";

class RandE extends Error {}

interface RandR {
  rand(): number;
}

class Rand extends Effect<RandR, RandE, number, []> {
  constructor() {
    super([], (runtime) => {
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

export class Add<Values extends AnyEffectA<number>[]> extends Effect<AddR, AddE, number, Values> {
  values;
  constructor(...values: Values) {
    super(values, (runtime, ...values) => {
      return values.reduce<number>((acc, cur) => {
        return runtime.add(acc, cur);
      }, 0);
    });
    this.values = values;
  }
}

export const add = <Values extends AnyEffectA<number>[]>(...values: Values): Add<Values> => {
  return new Add(...values);
};

//

class DoubleE extends Error {}

interface DoubleR {
  double(n: number): number;
}

class Double<N extends AnyEffectA<number>> extends Effect<DoubleR, DoubleE, number, [N]> {
  constructor(readonly value: N) {
    super([value], (runtime, resolved) => {
      return runtime.double(resolved);
    });
  }
}

export const double = <N extends AnyEffectA<number>>(value: N): Double<N> => {
  return new Double(value);
};

//

class RandomlyThrowErr extends Error {}

class RandomlyThrow<E extends AnyEffect> extends Effect<{}, RandomlyThrowErr, E[_A], [E]> {
  constructor(readonly effect: E) {
    super([effect], (_, e) => {
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
const c = add(a, b);
const d = randomlyThrow(c);

console.log(d);

console.log(d.toString());

const e = exec(d);

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
