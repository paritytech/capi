import { $, C } from "../../capi.ts"
import * as codecs from "../../codecs.ts"
import type * as types from "../mod.ts"

export type AssignmentKind =
  | types.polkadot_runtime_parachains.scheduler.AssignmentKind.Parachain
  | types.polkadot_runtime_parachains.scheduler.AssignmentKind.Parathread
export namespace AssignmentKind {
  export interface Parachain {
    type: "Parachain"
  }
  export interface Parathread {
    type: "Parathread"
    value: [types.polkadot_primitives.v2.collator_app.Public, types.u32]
  }
  export function Parachain(): types.polkadot_runtime_parachains.scheduler.AssignmentKind.Parachain {
    return { type: "Parachain" }
  }
  export function Parathread(
    ...value: types.polkadot_runtime_parachains.scheduler.AssignmentKind.Parathread["value"]
  ): types.polkadot_runtime_parachains.scheduler.AssignmentKind.Parathread {
    return { type: "Parathread", value }
  }
}

export interface CoreAssignment {
  core: types.polkadot_primitives.v2.CoreIndex
  paraId: types.polkadot_parachain.primitives.Id
  kind: types.polkadot_runtime_parachains.scheduler.AssignmentKind
  groupIdx: types.polkadot_primitives.v2.GroupIndex
}

export function CoreAssignment(value: types.polkadot_runtime_parachains.scheduler.CoreAssignment) {
  return value
}

export interface ParathreadClaimQueue {
  queue: Array<types.polkadot_runtime_parachains.scheduler.QueuedParathread>
  nextCoreOffset: types.u32
}

export function ParathreadClaimQueue(
  value: types.polkadot_runtime_parachains.scheduler.ParathreadClaimQueue,
) {
  return value
}

export interface QueuedParathread {
  claim: types.polkadot_primitives.v2.ParathreadEntry
  coreOffset: types.u32
}

export function QueuedParathread(
  value: types.polkadot_runtime_parachains.scheduler.QueuedParathread,
) {
  return value
}
