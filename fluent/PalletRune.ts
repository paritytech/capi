import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Chain } from "./ChainRune.ts"
import { ConstantRune } from "./ConstantRune.ts"
import { PatternRune } from "./PatternRune.ts"
import { StorageRune } from "./StorageRune.ts"

/** A pallet of the current chain */
export class PalletRune<
  out C extends Chain,
  out P extends Chain.PalletName<C>,
  out U,
> extends PatternRune<Chain.Pallet<C, P>, C, U> {
  /** Get the specified storage of the current pallet */
  storage<S extends Chain.StorageName<C, P>, X>(...args: RunicArgs<X, [storageName: S]>) {
    const [storageName] = RunicArgs.resolve(args)
    return this
      .into(ValueRune)
      .access("storage", storageName.as(Rune))
      .into(StorageRune, this.chain)
  }

  /** Get the specified constant of the current pallet */
  constant<K extends Chain.ConstantName<C, P>, X>(...args: RunicArgs<X, [constantName: K]>) {
    const [constantName] = RunicArgs.resolve(args)
    return this
      .into(ValueRune)
      .access("constants", constantName.as(Rune))
      .into(ConstantRune, this.chain)
  }
}
