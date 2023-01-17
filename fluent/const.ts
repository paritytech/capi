import * as M from "../frame_metadata/mod.ts"
import { Rune } from "../rune/mod.ts"
import { PalletRune } from "./pallet.ts"

export class ConstRune<out U> extends Rune<M.Constant, U> {
  constructor(_prime: ConstRune<U>["_prime"], readonly pallet: PalletRune<U>) {
    super(_prime)
    this.$value = this.pallet.metadata.codec(this.pipe((x) => x.ty))
    this.decoded = this.$value.decoded(this.pipe((x) => x.value))
  }

  $value
  decoded
}
