import * as U from "/util/mod.ts";

export const HexStringBrand: unique symbol = Symbol();
export type HexStringBrand = typeof HexStringBrand;
export type HexString = U.Branded<string, HexStringBrand>;

export const HashHexStringBrand: unique symbol = Symbol();
export type HashHexStringBrand = typeof HashHexStringBrand;
export type HashHexString = U.Branded<HexString, HashHexStringBrand>;

export const AccountIdBrand: unique symbol = Symbol();
export type AccountIdBrand = typeof AccountIdBrand;
export type AccountId = U.Branded<string, AccountIdBrand>;

export const SubscriptionIdBrand: unique symbol = Symbol();
export type SubscriptionIdBrand = typeof SubscriptionIdBrand;
export type SubscriptionId = U.Branded<string, SubscriptionIdBrand>;

export const MultiAddressBrand: unique symbol = Symbol();
export type MultiAddressBrand = typeof MultiAddressBrand;
export type MultiAddress = U.Branded<string, MultiAddressBrand>;

export const HexU64Brand: unique symbol = Symbol();
export type HexNumBrand = typeof HexU64Brand;
export type HexU64 = U.Branded<string, HexNumBrand>;
