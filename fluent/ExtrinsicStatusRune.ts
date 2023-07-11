import { Event, FrameMetadata, SystemExtrinsicFailedEvent } from "../frame_metadata/mod.ts"
import { known } from "../rpc/mod.ts"
import { is, OrthoRune, Run, Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { BlockHashRune } from "./BlockHashRune.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain } from "./ChainRune.ts"
import { PatternRune } from "./PatternRune.ts"
import { SignedExtrinsicRune } from "./SignedExtrinsicRune.ts"

export class ExtrinsicStatusRune<in out C extends Chain, out U1, out U2>
  extends PatternRune<Run<known.TransactionStatus, U1>, C, U2, SignedExtrinsicRune<C, U2>>
{
  dbgStatus<X>(...prefix: RunicArgs<X, unknown[]>): ExtrinsicStatusRune<C, U1, U2> {
    return this
      .into(OrthoRune)
      .orthoMap((rune) => rune.dbg(...prefix))
      .into(ExtrinsicStatusRune, this.chain, this.parent)
  }

  inBlock() {
    return this.statuses((status) =>
      known.TransactionStatus.isTerminal(status)
      || (typeof status !== "string" ? !!status.inBlock : false)
    )
      .map((status) =>
        typeof status !== "string" && status.inBlock ? status.inBlock : new NeverInBlockError()
      )
      .unhandle(is(NeverInBlockError))
      .into(BlockHashRune, this.chain)
  }

  inBlockEvents<P extends Chain.PalletName<C>, N extends Chain.RuntimeEventName<C, P>, X>(
    ...[palletName, eventName]: RunicArgs<X, [palletName?: P, eventName?: N]>
  ) {
    return this.events(this.inBlock().block(), palletName, eventName)
  }

  inBlockErrors() {
    return this.errors(this.inBlockEvents("System", "ExtrinsicFailed"))
  }

  finalized() {
    return this.statuses(known.TransactionStatus.isTerminal)
      .map((status) =>
        typeof status !== "string" && status.finalized
          ? status.finalized
          : new NeverFinalizedError()
      )
      .unhandle(is(NeverFinalizedError))
      .into(BlockHashRune, this.chain)
  }

  finalizedEvents<P extends Chain.PalletName<C>, N extends Chain.RuntimeEventName<C, P>, X>(
    ...[palletName, eventName]: RunicArgs<X, [palletName?: P, eventName?: N]>
  ) {
    return this.events(this.finalized().block(), palletName, eventName)
  }

  finalizedErrors() {
    return this.errors(this.finalizedEvents("System", "ExtrinsicFailed"))
  }

  private statuses(isTerminal: (txStatus: known.TransactionStatus) => boolean) {
    return this
      .into(OrthoRune)
      .orthoMap((events) => events.into(ValueRune).filter(isTerminal))
      .flatSingular()
  }

  private events<
    EU,
    X,
    P extends Chain.PalletName<C>,
    N extends Chain.RuntimeEventName<C, P>,
  >(
    block: BlockRune<C, EU>,
    ...[palletName, eventName]: RunicArgs<X, [palletName?: P, eventName?: N]>
  ) {
    const txI = Rune
      .tuple([block.into(ValueRune).access("block", "extrinsics"), this.parent.hex()])
      .map(([hexes, hex]) => {
        const i = hexes.indexOf("0x" + hex)
        return i === -1 ? undefined : i
      })
      .unhandle(is(undefined))
    return Rune
      .tuple([block.events(), txI, palletName, eventName])
      .map(([events, txI, palletName, eventName]) =>
        events.filter((event): event is Chain.Event<C, P, N> =>
          event.phase.type === "ApplyExtrinsic" && event.phase.value === txI
          && (palletName === undefined || event.event.type === palletName)
          && (eventName === undefined || event.event.value.type === eventName)
        )
      )
      .rehandle(is(undefined), () => Rune.constant([]))
      .unsafeAs<Chain.Event<C, P, N>[]>()
      .into(ValueRune)
  }

  private errors<X>(...[failedEvents]: RunicArgs<X, [events: Event[]]>) {
    return Rune
      .tuple([
        Rune.resolve(failedEvents).unsafeAs<SystemExtrinsicFailedEvent[]>(),
        this.chain.metadata,
      ])
      .map(([failedEvents, metadata]) => {
        const pallets = Object.fromEntries(
          Object
            .values(metadata.pallets)
            .map((pallet): [number, FrameMetadata.Pallet] => [pallet.id, pallet]),
        ) as Record<number, FrameMetadata.Pallet>
        return failedEvents.map((failedEvent) => {
          const { dispatchError } = failedEvent.event.value
          if (typeof dispatchError === "string") return dispatchError
          else {
            const { index, error } = dispatchError.value
            const pallet = pallets[index]
            if (!pallet || !pallet.types.error) throw new CannotDecodeExtrinsicFailureError()
            return pallet.types.error.decode(error)
          }
        })
      })
      .throws(is(CannotDecodeExtrinsicFailureError))
  }
}

export class CannotDecodeExtrinsicFailureError extends Error {}
export class NeverInBlockError extends Error {}
export class NeverFinalizedError extends Error {}
