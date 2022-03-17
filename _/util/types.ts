export type ValueOf<T> = T[keyof T];

export type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never;

// Sometimes, the checker isn't wise enough, and we must summon dark forces.
export type AsKeyof<K, T> = K extends keyof T ? K : never;

// export type UndefPropsAsOptional<T> =
//   & {
//     [Key in keyof Pick<T, AsKeyof<UndefPropsAsOptional._0<T>, T>>]+?: T[Key];
//   }
//   & {
//     [Key in keyof Omit<T, AsKeyof<UndefPropsAsOptional._0<T>, T>>]: T[Key];
//   };
// namespace UndefPropsAsOptional {
//   // We need this intermediate step so that we don't lose type-level docs.
//   // ... otherwise we'd inline the `as` of the mapped type.
//   export type _0<T> = keyof {
//     [Key in keyof T as undefined extends T[Key] ? Key : never]: Key;
//   };
// }
