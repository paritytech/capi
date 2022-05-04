import * as u from "/_/util/mod.ts";

const AccountId32Brand: unique symbol = Symbol();
export class AccountId32 extends u.branded<string>()(AccountId32Brand) {}
export const accountId32 = u.brandedFactory(AccountId32);
