import { type RuntimeEvent } from "http://localhost:4646/frame/dev/polkadot/@v0.9.36/types/polkadot_runtime.ts"
import { type Event as ProxyEvent } from "polkadot_dev/types/pallet_proxy/pallet.ts"
import { ChainRune, Event, MultiAddress, Rune, RunicArgs } from "../../mod.ts"

export function addProxy<U, X>(
  chain: ChainRune<U, any>,
  ...[proxy, delegate]: RunicArgs<X, [proxy: MultiAddress, delegate: MultiAddress]>
) {
  return chain.extrinsic({
    type: "Proxy",
    real: proxy,
    forceProxyType: undefined,
    call: Rune.rec({
      type: "addProxy",
      proxyType: "Any",
      delegate: delegate,
      delay: 0,
    }),
  })
}

export function removeProxy<U, X>(
  chain: ChainRune<U, any>,
  ...[proxy, delegate]: RunicArgs<X, [proxy: MultiAddress, delegate: MultiAddress]>
) {
  return chain.extrinsic({
    type: "Proxy",
    real: proxy,
    forceProxyType: undefined,
    call: Rune.rec({
      type: "removeProxy",
      proxyType: "Any",
      delegate: delegate,
      delay: 0,
    }),
  })
}

export function filterPureCreatedEvents<X>(...[events]: RunicArgs<X, [Event[]]>) {
  return Rune.resolve(events).map((events) =>
    events
      .map((e) => e.event)
      .filter((event): event is RuntimeEvent.Proxy => event.type === "Proxy")
      .map((e) => e.value)
      .filter((event): event is ProxyEvent.PureCreated => event.type === "PureCreated")
  )
}
