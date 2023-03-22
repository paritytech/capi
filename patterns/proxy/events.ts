import { Event as ProxyEvent } from "polkadot/types/pallet_proxy/pallet.js"
import { RuntimeEvent } from "polkadot/types/polkadot_runtime.js"
import { Rune, RunicArgs } from "../../mod.ts"

// TODO: constrain
export function filterPureCreatedEvents<X>(...[events]: RunicArgs<X, [any[]]>) {
  return Rune.resolve(events).map((events) =>
    events
      .map((e) => e.event)
      .filter(RuntimeEvent.isProxy)
      .map((e) => e.value)
      .filter(ProxyEvent.isPureCreated)
  )
}
