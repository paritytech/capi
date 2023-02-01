export type Branded<T, Brand extends PropertyKey> = T & { [_ in Brand]: true }

declare const _hex: unique symbol
export type Hex = Branded<string, typeof _hex>

declare const _hash: unique symbol
export type Hash = Branded<Uint8Array, typeof _hash>

export type HexHash = Hex & Hash
