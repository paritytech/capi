import { ss58 } from "../crypto/mod.ts"
import { ValueRune } from "../rune/ValueRune.ts"
import { AccountIdRune } from "./AccountIdRune.ts"
import { Chain } from "./ChainRune.ts"
import { PatternRune } from "./PatternRune.ts"

export class Ss58Rune<in out C extends Chain, U> extends PatternRune<string, C, U> {
  accountId() {
    return this
      .into(ValueRune)
      .map(ss58.decode)
      .access(1)
      .into(AccountIdRune)
  }
}
