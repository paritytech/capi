import { $ } from "../../capi.ts"
import * as _codec from "../../codecs.ts"
import type * as t from "../../mod.ts"

export const $assignmentKind: $.Codec<
  t.types.polkadot_runtime_parachains.scheduler.AssignmentKind
> = _codec.$665

export const $coreAssignment: $.Codec<
  t.types.polkadot_runtime_parachains.scheduler.CoreAssignment
> = _codec.$664

export const $parathreadClaimQueue: $.Codec<
  t.types.polkadot_runtime_parachains.scheduler.ParathreadClaimQueue
> = _codec.$654

export const $queuedParathread: $.Codec<
  t.types.polkadot_runtime_parachains.scheduler.QueuedParathread
> = _codec.$656

export type AssignmentKind =
  | t.types.polkadot_runtime_parachains.scheduler.AssignmentKind.Parachain
  | t.types.polkadot_runtime_parachains.scheduler.AssignmentKind.Parathread
export namespace AssignmentKind {
  export interface Parachain {
    type: "Parachain"
  }
  export interface Parathread {
    type: "Parathread"
    value: [t.types.polkadot_primitives.v2.collator_app.Public, t.types.u32]
  }
  export function Parachain(): t.types.polkadot_runtime_parachains.scheduler.AssignmentKind.Parachain {
    return { type: "Parachain" }
  }
  export function Parathread(
    ...value: t.types.polkadot_runtime_parachains.scheduler.AssignmentKind.Parathread["value"]
  ): t.types.polkadot_runtime_parachains.scheduler.AssignmentKind.Parathread {
    return { type: "Parathread", value }
  }
}

export interface CoreAssignment {
  core: t.types.polkadot_primitives.v2.CoreIndex
  para_id: t.types.polkadot_parachain.primitives.Id
  kind: t.types.polkadot_runtime_parachains.scheduler.AssignmentKind
  group_idx: t.types.polkadot_primitives.v2.GroupIndex
}

export function CoreAssignment(
  value: t.types.polkadot_runtime_parachains.scheduler.CoreAssignment,
) {
  return value
}

export interface ParathreadClaimQueue {
  queue: Array<t.types.polkadot_runtime_parachains.scheduler.QueuedParathread>
  next_core_offset: t.types.u32
}

export function ParathreadClaimQueue(
  value: t.types.polkadot_runtime_parachains.scheduler.ParathreadClaimQueue,
) {
  return value
}

export interface QueuedParathread {
  claim: t.types.polkadot_primitives.v2.ParathreadEntry
  core_offset: t.types.u32
}

export function QueuedParathread(
  value: t.types.polkadot_runtime_parachains.scheduler.QueuedParathread,
) {
  return value
}
