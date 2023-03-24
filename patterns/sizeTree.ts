import { mapEntries } from "../deps/std/collections/map_entries.ts"
import { Chain, ChainRune, MetaRune, Rune, RunicArgs, ValueRune } from "../mod.ts"

export function sizeTree<U, X>(
  chain: ChainRune<Chain, U>,
  ...[blockHash]: RunicArgs<X, [blockHash?: string]>
) {
  return chain.metadata
    .into(ValueRune)
    .map(({ pallets }) =>
      Rune.rec(mapEntries(pallets, ([palletName, pallet]) => [
        palletName,
        Rune.rec(mapEntries(pallet.storage, ([storageName, $storage]) => {
          const partialKeyType: string = $storage.partialKey._metadata[0]?.args[2]?._metadata[0]
            ?.name
          const partialKey = {
            $partialEmptyKey: undefined,
            $partialSingleKey: null,
            $partialMultiKey: [],
          }[partialKeyType]
          return [
            storageName,
            chain.pallet(pallet.name).storage(storageName).size(partialKey, blockHash),
          ]
        })),
      ]))
    )
    .into(MetaRune)
    .flat()
}
