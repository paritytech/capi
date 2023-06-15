import { PalletProxyEvent, RuntimeEvent } from "@capi/polkadot"
import { Rune, RunicArgs } from "../../../mod.ts"

export function filterPureCreatedEvents<X>(...[events]: RunicArgs<X, [any[]]>) {
  return Rune.resolve(events).map((events) =>
    events
      .map((e) => e.event)
      .filter((event): event is RuntimeEvent.Proxy => event.type === "Proxy")
      .map((e) => e.value)
      .filter((event): event is PalletProxyEvent.PureCreated => event.type === "PureCreated")
  )
}
