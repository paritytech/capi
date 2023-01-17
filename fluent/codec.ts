import * as $ from "../deps/scale.ts"
import { Args, Rune } from "../rune/mod.ts"

export class CodecRune<T, U> extends Rune<$.Codec<T>, U> {
  // TODO: eventually, utilize `V` to toggle runtime validation
  encoded<X>(...[value]: Args<X, [value: T]>) {
    return Rune.ls([this, value]).pipe(async ([codec, value]) => {
      try {
        $.assert(codec, value)
      } catch (e) {
        return e as $.ScaleAssertError
      }
      return await codec.encodeAsync(value)
    })
  }

  decoded<X>(...[value]: Args<X, [value: Uint8Array]>) {
    return Rune.ls([this, value]).pipe(async ([codec, value]) => codec.decode(value))
  }
}
