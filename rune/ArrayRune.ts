import { MetaRune } from "./MetaRune.ts"
import { Rune } from "./Rune.ts"
import { ValueRune } from "./ValueRune.ts"

export class ArrayRune<T, U> extends Rune<T[], U> {
  mapArray<T2, U2>(
    fn: (value: ValueRune<T, never>) => Rune<T2, U2>,
  ): ArrayRune<T2, U | U2> {
    return this
      .as(ValueRune)
      .map((arr) => Rune.ls(arr.map((val) => fn(Rune.constant(val)))))
      .as(MetaRune)
      .flat(fn(Rune._placeholder().as(ValueRune)))
      .as(ArrayRune)
  }
}
