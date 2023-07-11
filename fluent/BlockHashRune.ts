import { is, Rune } from "../rune/mod.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain } from "./ChainRune.ts"
import { PatternRune } from "./PatternRune.ts"

export class BlockHashRune<in out C extends Chain, out U> extends PatternRune<string, C, U> {
  block() {
    return this.chain.connection
      .call("chain_getBlock", this.as(Rune))
      .unhandle(is(null))
      .into(BlockRune, this.chain, this)
  }
}
