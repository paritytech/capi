export type Narrow<T> =
  | (T extends infer U ? U : never)
  | (T extends number | string | boolean | bigint | symbol | null | undefined | [] ? T
    : { [K in keyof T]: Narrow<T[K]> });
