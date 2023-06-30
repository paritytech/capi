import { ss58 } from "../crypto/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { AccountIdRune } from "./AccountIdRune.ts"
import { Chain } from "./ChainRune.ts"
import { PatternRune } from "./PatternRune.ts"

/** A rune representing an SS58 address of a given chain */
export class Ss58Rune<out C extends Chain, U> extends PatternRune<string, C, U> {
  /** Get a rune representing the account ID corresponding to the current SS58 address */
  accountId() {
    return this
      .into(ValueRune)
      .map(ss58.decode)
      .access(1)
      .into(AccountIdRune)
  }
}
