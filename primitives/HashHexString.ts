import * as U from "/util/mod.ts";

const HashHexStringBrand: unique symbol = Symbol();
export class HashHexString extends U.branded<string>()(HashHexStringBrand) {}
export const hashHexStr = U.brandedFactory(HashHexString);
