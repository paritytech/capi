import { mapEntries } from "../../deps/std/collections/map_entries.ts"
import { Chain, ChainRune, MetaRune, Rune, RunicArgs, ValueRune } from "../../mod.ts"

export function storageSizes<C extends Chain, U, X>(
  chain: ChainRune<C, U>,
  ...[blockHash]: RunicArgs<X, [blockHash?: string]>
) {
  return chain.metadata
    .into(ValueRune)
    .map(({ pallets }) =>
      Rune.object(mapEntries(pallets, ([palletName, pallet]) => [
        palletName,
        Rune.object(
          mapEntries(pallet.storage, ([storageName]) => [
            storageName,
            chain.pallet(pallet.name).storage(storageName).size(null as never, blockHash),
          ]),
        ),
      ]))
    )
    .into(MetaRune)
    .flat()
}
