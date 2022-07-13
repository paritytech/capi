import { IsExact } from "../../_deps/conditional_type_checks.ts";
import { ErrorCtor } from "../../util/mod.ts";
import { AnyAtom, atom } from "./Atom.ts";
import { E_, T_, Val } from "./Effect.ts";

declare function assert<_InQuestion extends true>(): void;
type EIs<T extends AnyAtom, Expectation> = IsExact<E_<T>, Expectation>;
type TIs<T extends AnyAtom, Expectation> = IsExact<T_<T>, Expectation>;

function asOrErr<E extends Error>() {
  return <T>(val: T) => {
    return val as T | E;
  };
}

export namespace Math {
  class _AddError extends ErrorCtor("Add") {}
  class _SubtractError extends ErrorCtor("Subtract") {}
  class _MultiplyError extends ErrorCtor("Multiply") {}
  class _DivideError extends ErrorCtor("Divide") {}

  function add<A extends Val<number>, B extends Val<number>>(a: A, b: B) {
    return atom("add", [a, b], (a, b) => {
      return asOrErr<_AddError>()(a + b);
    });
  }

  function subtract<A extends Val<number>, B extends Val<number>>(a: A, b: B) {
    return atom("subtract", [a, b], (a, b) => {
      return asOrErr<_SubtractError>()(a + b);
    });
  }

  function multiply<A extends Val<number>, B extends Val<number>>(a: A, b: B) {
    return atom("multiply", [a, b], (a, b) => {
      return asOrErr<_MultiplyError>()(a + b);
    });
  }

  function divide<A extends Val<number>, B extends Val<number>>(a: A, b: B) {
    return atom("divide", [a, b], (a, b) => {
      return asOrErr<_DivideError>()(a + b);
    });
  }

  const t0 = add(1, 2);
  assert<EIs<typeof t0, _AddError>>();
  // @ts-expect-error
  assert<EIs<typeof t0, _SubtractError>>();
  assert<TIs<typeof t0, number>>();

  const t1 = add(t0, 3);
  assert<TIs<typeof t1, number>>();
  assert<EIs<typeof t1, _AddError>>();
  // @ts-expect-error
  assert<EIs<typeof t1, _SubtractError>>();

  const t2 = add(t0, t1);
  assert<TIs<typeof t2, number>>();
  assert<EIs<typeof t2, _AddError>>();
  // @ts-expect-error
  assert<EIs<typeof t2, _SubtractError>>();

  const t3 = subtract(10, t2);
  assert<TIs<typeof t3, number>>();
  assert<EIs<typeof t3, _AddError | _SubtractError>>();
  // @ts-expect-error
  assert<EIs<typeof t3, _AddError>>();
  // @ts-expect-error
  assert<EIs<typeof t3, _SubtractError>>();

  const t4 = subtract(t2, t3);
  assert<TIs<typeof t4, number>>();
  assert<EIs<typeof t4, _AddError | _SubtractError>>();
  // @ts-expect-error
  assert<EIs<typeof t4, _AddError>>();
  // @ts-expect-error
  assert<EIs<typeof t4, _SubtractError>>();

  const t5 = subtract(100, t4);
  assert<TIs<typeof t5, number>>();
  assert<EIs<typeof t5, _AddError | _SubtractError>>();
  // @ts-expect-error
  assert<EIs<typeof t5, _AddError>>();
  // @ts-expect-error
  assert<EIs<typeof t5, _SubtractError>>();

  const t6 = multiply(100, 100);
  assert<TIs<typeof t6, number>>();
  assert<EIs<typeof t6, _MultiplyError>>();
  // @ts-expect-error
  assert<EIs<typeof t6, _MultiplyError | _AddError | _SubtractError>>();
  // @ts-expect-error
  assert<EIs<typeof t6, _AddError>>();

  const t7 = multiply(t5, 100);
  assert<TIs<typeof t7, number>>();
  assert<EIs<typeof t7, _AddError | _SubtractError | _MultiplyError>>();
  // @ts-expect-error
  assert<EIs<typeof t7, _AddError>>();
  // @ts-expect-error
  assert<EIs<typeof t7, _SubtractError>>();

  const t8 = multiply(t5, t7);
  assert<TIs<typeof t8, number>>();
  assert<EIs<typeof t8, _AddError | _SubtractError | _MultiplyError>>();
  // @ts-expect-error
  assert<EIs<typeof t8, _AddError>>();
  // @ts-expect-error
  assert<EIs<typeof t8, _SubtractError>>();

  const t9 = divide(t8, 2);
  assert<TIs<typeof t9, number>>();
  assert<EIs<typeof t9, _AddError | _SubtractError | _MultiplyError | _DivideError>>();
  // @ts-expect-error
  assert<EIs<typeof t9, _AddError | _SubtractError | _MultiplyError>>();
  // @ts-expect-error
  assert<EIs<typeof t9, _AddError>>();
  // @ts-expect-error
  assert<EIs<typeof t9, _SubtractError>>();

  const t10 = divide(t8, t9);
  assert<TIs<typeof t10, number>>();
  assert<EIs<typeof t10, _AddError | _SubtractError | _MultiplyError | _DivideError>>();
  // @ts-expect-error
  assert<EIs<typeof t10, _AddError | _SubtractError | _MultiplyError>>();
  // @ts-expect-error
  assert<EIs<typeof t10, _AddError>>();
  // @ts-expect-error
  assert<EIs<typeof t10, _SubtractError>>();
}
