export type Branded<T, Brand extends PropertyKey> = T & { [_ in Brand]: undefined };

export const HexStringBrand: unique symbol = Symbol();
export type HexStringBrand = typeof HexStringBrand;
export type HexString = Branded<string, HexStringBrand>;

export const HashHexStringBrand: unique symbol = Symbol();
export type HashHexStringBrand = typeof HashHexStringBrand;
export type HashHexString = Branded<HexString, HashHexStringBrand>;

export const AccountIdStringBrand: unique symbol = Symbol();
export type AccountIdStringBrand = typeof AccountIdStringBrand;
export type AccountIdString = Branded<string, AccountIdStringBrand>;

export const SubscriptionIdStringBrand: unique symbol = Symbol();
export type SubscriptionIdStringBrand = typeof SubscriptionIdStringBrand;
export type SubscriptionIdString = Branded<string, SubscriptionIdStringBrand>;

export const MultiAddressStringBrand: unique symbol = Symbol();
export type MultiAddressStringBrand = typeof MultiAddressStringBrand;
export type MultiAddressString = Branded<string, MultiAddressStringBrand>;

export const HexU64StringBrand: unique symbol = Symbol();
export type HexU64StringBrand = typeof HexU64StringBrand;
export type HexU64String = Branded<string, HexU64StringBrand>;

export const H256StringBrand: unique symbol = Symbol();
export type H256StringBrand = typeof H256StringBrand;
export type H256String = Branded<string, H256StringBrand>;
