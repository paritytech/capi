export type ValueOf<T> = T[keyof T]

export type U2I<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R
  : never
