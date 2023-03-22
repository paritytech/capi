import { Polkadot, Proxy } from "polkadot/mod.js"
import { MultiAddress } from "polkadot/types/sp_runtime/multiaddress.js"
import { Chain, ChainRune, RunicArgs } from "../../mod.ts"

// TODO: incorporate `C` into pick util types
export type ProxyChain<C extends Chain> = Chain.PickCall<
  Polkadot,
  "Proxy",
  "proxy" | "addProxy" | "removeProxy"
>

export function replaceDelegateCalls<C extends Chain, U, X>(
  chain: ChainRune<ProxyChain<C>, U>,
  ...[real, from, to]: RunicArgs<X, [real: MultiAddress, from: MultiAddress, to: MultiAddress]>
) {
  return [
    chain.extrinsic(Proxy.proxy({
      real,
      forceProxyType: undefined,
      call: Proxy.addProxy({
        proxyType: "Any",
        delegate: to,
        delay: 0,
      }),
    })),
    chain.extrinsic(Proxy.proxy({
      real,
      forceProxyType: undefined,
      call: Proxy.removeProxy({
        proxyType: "Any",
        delegate: from,
        delay: 0,
      }),
    })),
  ]
}
