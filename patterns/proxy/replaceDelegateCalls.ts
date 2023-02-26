import { ChainRune, MultiAddress, Rune, RunicArgs } from "../../mod.ts"

export function replaceDelegateCalls<U, X>(
  chain: ChainRune<U, any>,
  ...[real, from, to]: RunicArgs<X, [real: MultiAddress, from: MultiAddress, to: MultiAddress]>
) {
  return [
    chain.extrinsic(Rune.rec({
      type: "Proxy",
      value: Rune.rec({
        type: "proxy",
        real,
        forceProxyType: "Any",
        call: chain.extrinsic(Rune.rec({
          type: "Proxy",
          value: Rune.rec({
            type: "addProxy",
            proxyType: "Any",
            delegate: to,
            delay: 0,
          }),
        })),
      }),
    })),
    chain.extrinsic(Rune.rec({
      type: "Proxy",
      value: Rune.rec({
        type: "proxy",
        real,
        forceProxyType: "Any",
        call: chain.extrinsic(Rune.rec({
          type: "Proxy",
          value: Rune.rec({
            type: "removeProxy",
            proxyType: "Any",
            delegate: from,
            delay: 0,
          }),
        })),
      }),
    })),
  ]
}
