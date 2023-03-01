import { type Event as ProxyEvent } from "polkadot_dev/types/pallet_proxy/pallet.ts"
import { type RuntimeEvent } from "polkadot_dev/types/polkadot_runtime.ts"
import { Event, Rune, RunicArgs } from "../../mod.ts"

export function filterPureCreatedEvents<X>(...[events]: RunicArgs<X, [Event[]]>) {
  return Rune.resolve(events).map((events) =>
    events
      .map((e) => e.event)
      .filter((event): event is RuntimeEvent.Proxy => event.type === "Proxy")
      .map((e) => e.value)
      .filter((event): event is ProxyEvent.PureCreated => event.type === "PureCreated")
  )
}
