import * as U from "/util/mod.ts";

const AccountId32Brand: unique symbol = Symbol();
export class AccountId32 extends U.branded<string>()(AccountId32Brand) {}
export const accountId32 = U.brandedFactory(AccountId32);
