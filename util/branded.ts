type Branded<T, Brand extends PropertyKey> = T & { [_ in Brand]: undefined };

export const HexStringBrand: unique symbol = Symbol();
export type HexString = Branded<string, typeof HexStringBrand>;

export const HashHexStringBrand: unique symbol = Symbol();
export type HashHexString = Branded<HexString, typeof HashHexStringBrand>;

export const AccountIdStringBrand: unique symbol = Symbol();
export type AccountIdString = Branded<string, typeof AccountIdStringBrand>;

export const SubscriptionIdStringBrand: unique symbol = Symbol();
export type SubscriptionIdString = Branded<string, typeof SubscriptionIdStringBrand>;

export const MultiAddressStringBrand: unique symbol = Symbol();
export type MultiAddressString = Branded<string, typeof MultiAddressStringBrand>;

export const HexU64StringBrand: unique symbol = Symbol();
export type HexU64String = Branded<string, typeof HexU64StringBrand>;

export const WsUrlStringBrand: unique symbol = Symbol();
export type WsUrlString = Branded<string, typeof HexStringBrand>;

export const ChainSpecStringBrand: unique symbol = Symbol();
export type ChainSpecString = Branded<string, typeof ChainSpecStringBrand>;
