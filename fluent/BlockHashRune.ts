import { is } from "../rune/mod.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain } from "./ChainRune.ts"
import { PatternRune } from "./PatternRune.ts"

/** A rune representing a block hash */
export class BlockHashRune<out C extends Chain, out U> extends PatternRune<string, C, U> {
  /** Get the block at the current block hash */
  block() {
    return this.chain.connection
      .call("chain_getBlock", this.as(BlockHashRune))
      .unhandle(is(null))
      .into(BlockRune, this.chain, this)
  }
}
