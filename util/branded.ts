import { HasherKind } from "../frame_metadata/Metadata.ts";

export type Branded<T, Brand extends PropertyKey, V = undefined> = T & Record<Brand, V>;

declare const _hex: unique symbol;
export type Hex<T extends Uint8Array = Uint8Array> = Branded<string, typeof _hex, T>;

declare const _encoded: unique symbol;
export type Encoded<T> = Branded<Uint8Array, typeof _encoded, T>;

declare const _hash: unique symbol;
export type Hash<T = unknown, K extends HasherKind = HasherKind> = Branded<
  Uint8Array,
  typeof _hash,
  [T, K]
>;

export type HexEncoded<T> = Hex<Encoded<T>>;
export type HexHash<T = unknown, K extends HasherKind = HasherKind> = Hex<Hash<T, K>>;

// export const HexStringBrand: unique symbol = Symbol();
// export type HexStringBrand = typeof HexStringBrand;
// export type HexString = Branded<string, HexStringBrand>;

// export const HashHexStringBrand: unique symbol = Symbol();
// export type HashHexStringBrand = typeof HashHexStringBrand;
// export type HashHexString = Branded<HexString, HashHexStringBrand>;

// export const AccountIdStringBrand: unique symbol = Symbol();
// export type AccountIdStringBrand = typeof AccountIdStringBrand;
// export type AccountIdString = Branded<string, AccountIdStringBrand>;

// export const SubscriptionIdStringBrand: unique symbol = Symbol();
// export type SubscriptionIdStringBrand = typeof SubscriptionIdStringBrand;
// export type SubscriptionIdString = Branded<string, SubscriptionIdStringBrand>;

// export const MultiAddressStringBrand: unique symbol = Symbol();
// export type MultiAddressStringBrand = typeof MultiAddressStringBrand;
// export type MultiAddressString = Branded<string, MultiAddressStringBrand>;

// export const HexU64StringBrand: unique symbol = Symbol();
// export type HexU64StringBrand = typeof HexU64StringBrand;
// export type HexU64String = Branded<string, HexU64StringBrand>;
