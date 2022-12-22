import * as $ from "../../deps/scale.ts"
import * as Z from "../../deps/zones.ts"
import { ContractMetadata, DeriveCodec } from "../../frame_metadata/mod.ts"
import { ExtrinsicEvent } from "../events.ts"

export function events(
  contractMetadata: Z.$<ContractMetadata>,
  events: Z.$<ExtrinsicEvent[]>,
) {
  const $events = Z.ls(contractMetadata).next(([contractMetadata]) => {
    return $.taggedUnion(
      "type",
      contractMetadata.V3.spec.events
        .map((e) => [
          e.label,
          [
            "value",
            $.tuple(...e.args.map((a) => DeriveCodec(contractMetadata.V3.types)(a.type.type))),
          ],
        ]),
    )
  })
  return Z.ls(events, $events).next(([events, $events]) => {
    return events
      .filter((e) => e.event?.type === "Contracts" && e.event?.value?.type === "ContractEmitted")
      .map((e) => $events.decode(e.event?.value.data))
  })
}
