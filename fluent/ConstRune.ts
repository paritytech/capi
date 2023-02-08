import * as M from "../frame_metadata/mod.ts"
import { Rune, ValueRune } from "../rune/mod.ts"
import { PalletRune } from "./PalletRune.ts"

export class ConstRune<out U> extends Rune<M.Constant, U> {
  $value
  decoded

  constructor(_prime: ConstRune<U>["_prime"], readonly pallet: PalletRune<U>) {
    super(_prime)
    this.$value = this.pallet.metadata.codec(this.into(ValueRune).access("ty"))
    this.decoded = this.$value.decoded(this.into(ValueRune).access("value"))
  }
}
