import * as u from "/_/util/mod.ts";

const AccountId32Brand: unique symbol = Symbol();
export class AccountId32 extends u.branded<string>()(AccountId32Brand) {}
export const accountId32 = u.brandedFactory(AccountId32);

const HexStringBrand: unique symbol = Symbol();
class HexString extends u.branded<string>()(HexStringBrand) {}
export const hexStr = u.brandedFactory(HexString);

const HashHexStringBrand: unique symbol = Symbol();
class HashHexString extends u.branded<string>()(HashHexStringBrand) {}
export const hashHexStr = u.brandedFactory(HashHexString);
