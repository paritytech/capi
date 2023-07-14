import * as $ from "../deps/scale.ts"
import { is, Rune, RunicArgs } from "../rune/mod.ts"

export class CodecRune<in I, out O, out U> extends Rune<$.Codec<I, O>, U> {
  static from<X, T>(...[codec]: RunicArgs<X, [codec: $.Codec<T>]>) {
    return Rune.resolve(codec).into(CodecRune)
  }

  // TODO: eventually, utilize `V` to toggle runtime validation
  /** A rune representing the scale-encoded equivalent of the specified value */
  encoded<X>(...[value]: RunicArgs<X, [value: I]>) {
    return Rune.tuple([this, value]).map(async ([codec, value]) => {
      $.assert(codec, value)
      return await codec.encodeAsync(value)
    }).throws(is($.ScaleError))
  }

  /** A rune representing the scale-decoded equivalent of the specified scale-encoded value */
  decoded<X>(...[value]: RunicArgs<X, [value: Uint8Array]>) {
    return Rune
      .tuple([this, value]).map(([codec, value]) => codec.decode(value))
      .throws(is($.ScaleError))
  }
}
