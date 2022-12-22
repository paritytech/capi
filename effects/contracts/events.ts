import * as $ from "../../deps/scale.ts"
import * as Z from "../../deps/zones.ts"
import { Metadata as InkMetadata } from "../../ink_metadata/mod.ts"
import { DeriveCodec } from "../../scale_info/mod.ts"
import { ExtrinsicEvent } from "../events.ts"

export function events(inkMetadata: Z.$<InkMetadata>, events: Z.$<ExtrinsicEvent[]>) {
  const $events = Z
    .ls(inkMetadata)
    .next(([inkMetadata]) =>
      $.taggedUnion(
        "type",
        inkMetadata.V3.spec.events
          .map((e) => [
            e.label,
            [
              "value",
              $.tuple(...e.args.map((a) => DeriveCodec(inkMetadata.V3.types)(a.type.type))),
            ],
          ]),
      )
    )
  return Z.ls(events, $events).next(([events, $events]) =>
    events
      .filter((e) => e.event?.type === "Contracts" && e.event?.value?.type === "ContractEmitted")
      .map((e) => $events.decode(e.event?.value.data))
  )
}
