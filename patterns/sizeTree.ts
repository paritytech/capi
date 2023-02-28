import { Chain, ChainRune, MetaRune, Rune, RunicArgs, ValueRune } from "../mod.ts"

export function sizeTree<U, C extends Chain, X>(
  chain: ChainRune<U, C>,
  ...[blockHash]: RunicArgs<X, [blockHash?: string]>
) {
  const metadata = chain.metadata(blockHash)
  return metadata
    .into(ValueRune)
    .map(({ pallets }) =>
      Rune.rec(Object.fromEntries(pallets.map((pallet) => [
        pallet.name,
        Rune.rec(Object.fromEntries(
          pallet.storage?.entries.map((entry) => [
            entry.name,
            metadata.pallet(pallet.name).storage(entry.name).size([], blockHash),
          ]) || [],
        )),
      ])))
    )
    .into(MetaRune)
    .flat()
}
