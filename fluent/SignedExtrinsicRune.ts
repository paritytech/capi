import { Rune, ValueRune } from "../rune/mod.ts"
import { hex } from "../util/mod.ts"
import { Chain, ClientRune } from "./ClientRune.ts"
import { ExtrinsicStatusRune } from "./ExtrinsicStatusRune.ts"
import { author } from "./rpc_method_runes.ts"

export class SignedExtrinsicRune<out U, out C extends Chain = Chain> extends Rune<Uint8Array, U> {
  constructor(_prime: SignedExtrinsicRune<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }

  hex() {
    return this.into(ValueRune).map(hex.encode)
  }

  sent() {
    return this
      .hex()
      .map((hex) => author.submitAndWatchExtrinsic(this.client, hex))
      .into(ExtrinsicStatusRune, this)
  }
}
