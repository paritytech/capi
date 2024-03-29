import { Expand } from "../../deps/scale.ts"

export type SerdeResult<O, E> = SerdeEnum<{ Ok: O; Err: E }>
export type SerdeEnum<T> = {
  [K in keyof T]: T[K] extends void ? K : Expand<Pick<T, K> & Omit<{ [K in keyof T]?: never }, K>>
}[keyof T]

export type SubId = string
export type AccountId = string
export type Subscription<T extends string, U> = [unsubscribe: T, result: U]
export namespace Subscription {
  export type UnsubscribeMethod<T> = T extends Subscription<infer U extends string, any> ? U : never
  export type Result<T> = T extends Subscription<any, infer U> ? U : never
}
export type NumberOrHex = string | number
export type ListOrValue<T> = T | T[]
