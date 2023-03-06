import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { Chain, ChainRune } from "./ChainRune.ts"
import { ConstantRune } from "./ConstantRune.ts"
import { StorageRune } from "./StorageRune.ts"

export class PalletRune<
  out C extends Chain,
  out P extends Chain.PalletName<C>,
  out U,
> extends Rune<Chain.Pallet<C, P>, U> {
  constructor(_prime: PalletRune<C, P, U>["_prime"], readonly chain: ChainRune<C, U>) {
    super(_prime)
  }

  storage<S extends Chain.StorageName<C, P>, X>(...args: RunicArgs<X, [storageName: S]>) {
    const [storageName] = RunicArgs.resolve(args)
    return this
      .into(ValueRune)
      .access("storage", storageName.as(Rune))
      .into(StorageRune, this)
  }

  constant<K extends Chain.ConstantName<C, P>, X>(...args: RunicArgs<X, [constantName: K]>) {
    const [constantName] = RunicArgs.resolve(args)
    return this
      .into(ValueRune)
      .access("constants", constantName.as(Rune))
      .into(ConstantRune, this.as(PalletRune))
  }
}
