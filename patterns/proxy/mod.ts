import { types } from "polkadot_dev/mod.ts"
import { Proxy } from "polkadot_dev/mod.ts"
import { Event } from "polkadot_dev/types/pallet_proxy/pallet.ts"
import { RuntimeEvent } from "polkadot_dev/types/polkadot_runtime.ts"
import { hex, MultiAddress, Rune, RunicArgs } from "../../mod.ts"

export function addProxy<X>(
  ...[proxy, delegate]: RunicArgs<X, [proxy: MultiAddress, delegate: MultiAddress]>
) {
  return Proxy.proxy({
    real: proxy,
    forceProxyType: undefined,
    call: Proxy.addProxy({
      proxyType: "Any",
      delegate: delegate,
      delay: 0,
    }),
  })
}

export function removeProxy<X>(
  ...[proxy, delegate]: RunicArgs<X, [proxy: MultiAddress, delegate: MultiAddress]>
) {
  return Proxy.proxy({
    real: proxy,
    forceProxyType: undefined,
    call: Proxy.removeProxy({
      proxyType: "Any",
      delegate: delegate,
      delay: 0,
    }),
  })
}

export function getMultiAddress<X1>(
  ...[mapping]: RunicArgs<X1, [Record<string, Uint8Array>]>
) {
  return function<X2>(...[accountId]: RunicArgs<X2, [Uint8Array]>) {
    return Rune
      .tuple([mapping, accountId])
      .map(([mapping, accountId]) =>
        MultiAddress.Id(mapping[hex.encode(accountId)] ?? new Uint8Array())
      )
  }
}

export function filterPureCreatedEvents<X>(
  ...[events]: RunicArgs<X, [types.frame_system.EventRecord[]]>
) {
  return Rune
    .resolve(events)
    .map((events) =>
      events
        .map((e) => e.event)
        .filter(RuntimeEvent.isProxy)
        .map((e) => e.value)
        .filter(Event.isPureCreated)
    )
}
