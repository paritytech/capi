import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Chain } from "./ChainRune.ts"
import { ConstantRune } from "./ConstantRune.ts"
import { PatternRune } from "./PatternRune.ts"
import { StorageRune } from "./StorageRune.ts"

export class PalletRune<
  in out C extends Chain,
  out P extends Chain.PalletName<C>,
  out U,
> extends PatternRune<Chain.Pallet<C, P>, C, U> {
  storage<S extends Chain.StorageName<C, P>, X>(...args: RunicArgs<X, [storageName: S]>) {
    const [storageName] = RunicArgs.resolve(args)
    return this
      .into(ValueRune)
      .access("storage", storageName.as(Rune))
      .into(StorageRune, this.chain)
  }

  constant<K extends Chain.ConstantName<C, P>, X>(...args: RunicArgs<X, [constantName: K]>) {
    const [constantName] = RunicArgs.resolve(args)
    return this
      .into(ValueRune)
      .access("constants", constantName.as(Rune))
      .into(ConstantRune, this.chain)
  }
}
