import * as $ from "../deps/scale.ts"
import { Rune, RunicArgs } from "../rune/mod.ts"

export class CodecRune<T, U> extends Rune<$.Codec<T>, U> {
  // TODO: eventually, utilize `V` to toggle runtime validation
  encoded<X>(...[value]: RunicArgs<X, [value: T]>) {
    return Rune.ls([this, value]).map(async ([codec, value]) => {
      try {
        $.assert(codec, value)
      } catch (e) {
        return e as $.ScaleAssertError
      }
      return await codec.encodeAsync(value)
    })
  }

  decoded<X>(...[value]: RunicArgs<X, [value: Uint8Array]>) {
    return Rune.ls([this, value]).map(([codec, value]) => codec.decode(value))
  }
}
