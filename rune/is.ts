import { getOrInit } from "../util/state.ts"

export interface Guard<T, Y extends T> {
  (value: T): value is Y
}

export function is(guard: undefined): Guard<unknown, undefined>
export function is(guard: null): Guard<unknown, null>
export function is<T>(guard: typeof Number): Guard<T, T & number>
export function is<T>(guard: typeof String): Guard<T, T & string>
export function is<T>(guard: typeof Boolean): Guard<T, T & boolean>
export function is<T>(guard: typeof BigInt): Guard<T, T & bigint>
export function is<T>(guard: typeof Symbol): Guard<T, T & symbol>
export function is<T>(guard: true): Guard<T, T & true>
export function is<T>(guard: false): Guard<T, T & false>
export function is<T>(guard: abstract new(...args: any) => T): Guard<unknown, T>
export function is<
  T extends string | { type: string },
  U extends T extends { type: string } ? T["type"] : T,
>(
  guard: U,
): Guard<T, Extract<T, U | { type: U }>>
export function is(guard: any): Guard<unknown, any> {
  switch (guard) {
    case undefined:
      return isUndefined
    case null:
      return isNull
    case Number:
      return isNumber
    case String:
      return isString
    case Boolean:
      return isBoolean
    case BigInt:
      return isBigInt
    case Symbol:
      return isSymbol
    default:
      if (typeof guard === "string") {
        return isType(guard)
      } else if (typeof guard === "boolean") {
        return guard ? isTrue : isFalse
      }
      {
        return isInstance(guard)
      }
  }
}

function isUndefined(x: unknown): x is undefined {
  return typeof x === "undefined"
}

function isNull(x: unknown): x is null {
  return x === null
}

function isNumber(x: unknown): x is number {
  return typeof x === "number"
}

function isString(x: unknown): x is string {
  return typeof x === "string"
}

function isBoolean(x: unknown): x is boolean {
  return typeof x === "boolean"
}

function isBigInt(x: unknown): x is bigint {
  return typeof x === "bigint"
}

function isSymbol(x: unknown): x is symbol {
  return typeof x === "symbol"
}

function isTrue(x: unknown): x is true {
  return x === true
}

function isFalse(x: unknown): x is false {
  return x === false
}

function isType<
  T extends string | { type: string },
  U extends T extends { type: string } ? T["type"] : T,
>(type: U) {
  return (value: T): value is Extract<T, U | { type: U }> =>
    (value as any) === type || (value as any).type === type
}

const isInstanceMemo = new WeakMap<abstract new(...args: any) => any, Guard<unknown, any>>()
function isInstance<T>(ctor: abstract new(...args: any) => T): Guard<unknown, T> {
  return getOrInit(
    isInstanceMemo,
    ctor,
    () => (value: unknown): value is T => value instanceof ctor,
  )
}

// Exclude<unknown, null> === unknown
// SmartExclude<unknown, null> === {} | undefined
export type SmartExclude<T1, T2 extends T1> = T2 extends null | undefined
  ? T1 & Exclude<{} | null | undefined, T2>
  : Exclude<T1, T2>
