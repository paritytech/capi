import { HasherKind } from "../frame_metadata/Metadata.ts"
export type Branded<T, Brand extends PropertyKey, V = undefined> = T & { [_ in Brand]: V }

declare const _hex: unique symbol
export type Hex<T extends Uint8Array = Uint8Array> = Branded<string, typeof _hex, T>

declare const _encoded: unique symbol
export type Encoded<T> = Branded<Uint8Array, typeof _encoded, T>

declare const _hash: unique symbol
export type Hash<T = unknown, K extends HasherKind = HasherKind> = Branded<
  Uint8Array,
  typeof _hash,
  [T, K]
>

export type HexEncoded<T> = Hex<Encoded<T>>
export type HexHash<T = unknown, K extends HasherKind = HasherKind> = Hex<Hash<T, K>>
