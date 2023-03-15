import { Chain, ChainRune, MetaRune, Rune, RunicArgs, ValueRune } from "../mod.ts"

export function sizeTree<C extends Chain, U, X>(
  chain: ChainRune<C, U>,
  ...[blockHash]: RunicArgs<X, [blockHash?: string]>
) {
  return chain.metadata
    .into(ValueRune)
    .map(({ pallets }) =>
      Rune.rec(Object.fromEntries(
        Object.values(pallets).map((pallet) => [
          pallet.name,
          Rune.rec(Object.fromEntries(
            Object.values(pallet.storage).map((entry) => [
              entry.name,
              chain.pallet(pallet.name).storage(entry.name).size(undefined!, blockHash),
            ]) || [],
          )),
        ]),
      ))
    )
    .into(MetaRune)
    .flat()
}
