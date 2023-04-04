import { type Event as ProxyEvent } from "@capi/polkadot/types/pallet_proxy/pallet.js"
import { type RuntimeEvent } from "@capi/polkadot/types/polkadot_runtime.js"
import { Rune, RunicArgs } from "../../mod.ts"

export function filterPureCreatedEvents<X>(...[events]: RunicArgs<X, [any[]]>) {
  return Rune.resolve(events).map((events) =>
    events
      .map((e) => e.event)
      .filter((event): event is RuntimeEvent.Proxy => event.type === "Proxy")
      .map((e) => e.value)
      .filter((event): event is ProxyEvent.PureCreated => event.type === "PureCreated")
  )
}
