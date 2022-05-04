import * as u from "/_/util/mod.ts";

const HashHexStringBrand: unique symbol = Symbol();
export class HashHexString extends u.branded<string>()(HashHexStringBrand) {}
export const hashHexStr = u.brandedFactory(HashHexString);
