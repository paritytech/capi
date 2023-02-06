import { Chain } from "../../fluent/mod.ts"
import { Rune } from "../../rune/mod.ts"
import { InkMetadataRune } from "./InkMetadataRune.ts"

export class InkMsgRune<out U, out C extends Chain = Chain> extends Rune<Uint8Array, U> {
  constructor(_prime: InkMsgRune<U>["_prime"], readonly ink: InkMetadataRune<U, C>) {
    super(_prime)
  }
}
