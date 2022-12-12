import * as Z from "../deps/zones.ts"
import { known } from "../rpc/mod.ts"
import { entryRead } from "./entryRead.ts"
import { SignedExtrinsic } from "./extrinsic.ts"
import { chain } from "./rpc_known_methods.ts"

const k1_ = Symbol()
const k2_ = Symbol()

// TODO: attach this to `Extrinsic`?
export function events<Extrinsic extends SignedExtrinsic, FinalizedHash extends Z.$<known.Hash>>(
  extrinsic: Extrinsic,
  finalizedHash: FinalizedHash,
) {
  const client = extrinsic.client as Extrinsic["client"]
  const extrinsics = chain
    .getBlock(client)(finalizedHash)
    .access("block")
    .access("extrinsics")
  const idx = Z
    .ls(extrinsics, extrinsic.extrinsicHex as Extrinsic["extrinsicHex"])
    .next(([extrinsics, extrinsicHex]) => {
      return extrinsics.indexOf(extrinsicHex)
    }, k1_)
  const events = entryRead(client)("System", "Events", [], finalizedHash)
    .access("value")
    .as<{
      event?: Record<string, any>
      phase: { value: number }
    }[]>()
  return Z
    .ls(idx, events)
    .next(([idx, events]) => {
      return events.filter((event) => {
        return event.phase.value === idx
      })
    }, k2_)
}
