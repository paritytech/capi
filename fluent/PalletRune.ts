import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Chain } from "./ChainRune.ts"
import { ConstantRune } from "./ConstantRune.ts"
import { PatternRune } from "./PatternRune.ts"
import { StorageRune } from "./StorageRune.ts"

export class PalletRune<
  out C extends Chain,
  out P extends Chain.PalletName<C>,
  out U,
> extends PatternRune<Chain.Pallet<C, P>, C, U> {
  storage<N extends Chain.StorageName<C, P>, X>(...args: RunicArgs<X, [storageName: N]>) {
    const [storageName] = RunicArgs.resolve(args)
    return this
      .into(ValueRune)
      .access("storage", storageName.as(Rune))
      .into(StorageRune, this.chain)
  }

  constant<N extends Chain.ConstantName<C, P>, X>(...args: RunicArgs<X, [constantName: N]>) {
    const [constantName] = RunicArgs.resolve(args)
    return this
      .into(ValueRune)
      .access("constants", constantName.as(Rune))
      .into(ConstantRune, this.chain)
  }
}
