import { MultiAddress } from "../primitives/mod.ts"
import { Rune } from "../rune/mod.ts"
import { RunicArgs } from "../rune/Rune.ts"
import { Chain } from "./ClientRune.ts"

export class MultiAddressRune<out U, out C extends Chain = Chain> extends Rune<MultiAddress, U> {
  constructor(_prime: MultiAddressRune<U, C>["_prime"]) {
    super(_prime)
  }

  static id<X>(...[value]: RunicArgs<X, [value: Uint8Array]>) {
    return Rune
      .rec({
        type: "Id" as const,
        value,
      })
      .into(MultiAddressRune)
  }

  static index() {
    return Rune
      .rec({
        type: "Index" as const,
        value: null,
      })
      .into(MultiAddressRune)
  }

  static raw<X>(...[value]: RunicArgs<X, [value: Uint8Array]>) {
    return Rune
      .rec({
        type: "Raw" as const,
        value,
      })
      .into(MultiAddressRune)
  }

  static address32<X>(...[value]: RunicArgs<X, [value: Uint8Array]>) {
    return Rune
      .rec({
        type: "Address32" as const,
        value,
      })
      .into(MultiAddressRune)
  }

  static address20<X>(...[value]: RunicArgs<X, [value: Uint8Array]>) {
    return Rune
      .rec({
        type: "Address20" as const,
        value,
      })
      .into(MultiAddressRune)
  }
}
