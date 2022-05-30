import * as u from "../util/mod.ts";

const HexStringBrand: unique symbol = Symbol();
export class HexString extends u.branded<string>()(HexStringBrand) {}
export const hexStr = u.brandedFactory(HexString);
