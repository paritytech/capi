import { MultiAddress } from "@capi/polkadot"
import { Chain, ChainRune, Rune, RunicArgs } from "../../mod.ts"

// TODO: constrain
export function replaceDelegateCalls<C extends Chain, U, X>(
  chain: ChainRune<C, U>,
  ...[real, from, to]: RunicArgs<X, [real: MultiAddress, from: MultiAddress, to: MultiAddress]>
) {
  return [
    chain.extrinsic(Rune.rec({
      type: "Proxy",
      value: Rune.rec({
        type: "proxy",
        real,
        forceProxyType: undefined,
        call: Rune.rec({
          type: "Proxy",
          value: Rune.rec({
            type: "addProxy",
            proxyType: "Any",
            delegate: to,
            delay: 0,
          }),
        }),
      }),
    }) as any),
    chain.extrinsic(Rune.rec({
      type: "Proxy",
      value: Rune.rec({
        type: "proxy",
        real,
        forceProxyType: undefined,
        call: Rune.rec({
          type: "Proxy",
          value: Rune.rec({
            type: "removeProxy",
            proxyType: "Any",
            delegate: from,
            delay: 0,
          }),
        }),
      }),
    }) as any),
  ]
}
