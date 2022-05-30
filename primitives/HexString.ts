import * as U from "/util/mod.ts";

const HexStringBrand: unique symbol = Symbol();
export class HexString extends U.branded<string>()(HexStringBrand) {}
export const hexStr = U.brandedFactory(HexString);
