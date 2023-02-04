import * as $ from "../deps/scale.ts"
import { Rune, RunicArgs } from "../rune/mod.ts"

export class CodecRune<T, U> extends Rune<$.Codec<T>, U> {
  // TODO: eventually, utilize `V` to toggle runtime validation
  encoded<X>(...[value]: RunicArgs<X, [value: T]>) {
    return Rune.tuple([this, value]).map(async ([codec, value]) => {
      $.assert(codec, value)
      return await codec.encodeAsync(value)
    }).throws($.ScaleError)
  }

  decoded<X>(...[value]: RunicArgs<X, [value: Uint8Array]>) {
    return Rune.tuple([this, value]).map(([codec, value]) => codec.decode(value)).throws(
      $.ScaleError,
    )
  }
}