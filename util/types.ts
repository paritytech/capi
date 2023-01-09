export type ValueOf<T> = T[keyof T]

export type U2I<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R
  : never

export type PromiseOr<T> = T | Promise<T>

export function widenIndexSignature<V>(value: Record<PropertyKey, V>): Record<PropertyKey, V> {
  return value
}
