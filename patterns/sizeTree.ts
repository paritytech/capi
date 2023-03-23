import { unreachable } from "../deps/std/testing/asserts.ts"
import { Chain, ChainRune, MetaRune, Rune, RunicArgs, ValueRune } from "../mod.ts"

export function sizeTree<U, X>(
  chain: ChainRune<Chain, U>,
  ...[blockHash]: RunicArgs<X, [blockHash?: string]>
) {
  return chain.metadata
    .into(ValueRune)
    .map(({ pallets }) =>
      Rune.rec(Object.fromEntries(
        Object.values(pallets).map((pallet) => [
          pallet.name,
          Rune.rec(Object.fromEntries(
            Object.values(pallet.storage).map((entry) => {
              const partialKeyType = entry.partialKey._metadata[0]?.args[2]?._metadata[0]?.name
              const partialKey = (() => {
                switch (partialKeyType) {
                  case "$partialEmptyKey":
                    return undefined
                  case "$partialSingleKey":
                    return null
                  case "$partialMultiKey":
                    return []
                  default:
                    return unreachable()
                }
              })()
              const storage = chain.pallet(pallet.name).storage(entry.name)
              return [entry.name, storage.size(partialKey, blockHash)]
            }) || [],
          )),
        ]),
      ))
    )
    .into(MetaRune)
    .flat()
}
