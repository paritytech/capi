import { mapEntries } from "../deps/std/collections/map_entries.ts"
import { Chain, ChainRune, MetaRune, Rune, RunicArgs, ValueRune } from "../mod.ts"

export function storageSizes<U, X>(
  chain: ChainRune<Chain, U>,
  ...[blockHash]: RunicArgs<X, [blockHash?: string]>
) {
  return chain.metadata
    .into(ValueRune)
    .map(({ pallets }) =>
      Rune.rec(mapEntries(pallets, ([palletName, pallet]) => [
        palletName,
        Rune.rec(
          mapEntries(pallet.storage, ([storageName]) => [
            storageName,
            chain.pallet(pallet.name).storage(storageName).size(null, blockHash),
          ]),
        ),
      ]))
    )
    .into(MetaRune)
    .flat()
}
