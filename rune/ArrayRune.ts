import { MetaRune } from "./MetaRune.ts"
import { Rune } from "./Rune.ts"
import { ValueRune } from "./ValueRune.ts"

export class ArrayRune<T, U> extends Rune<T[], U> {
  mapArray<T2, U2>(
    fn: (value: ValueRune<T, never>) => Rune<T2, U2>,
  ): ArrayRune<T2, U | U2> {
    return this
      .into(ValueRune)
      .map((arr) => Rune.tuple(arr.map((val) => fn(Rune.constant(val)))))
      .into(MetaRune)
      .pin(fn(Rune._placeholder().into(ValueRune)))
      .flat()
      .into(ArrayRune)
  }
}

Rune.ArrayRune = ArrayRune
