import { HashHexString } from "../util/mod.ts";
import { Base } from "./Base.ts";
import { Chain } from "./Chain.ts";

export class Block<C extends Chain = Chain> extends Base<"Block"> {
  constructor(
    readonly chain: C,
    readonly hash?: HashHexString,
  ) {
    super("Block");
  }
}
