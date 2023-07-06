import {
  DispatchError,
  Event,
  isSystemExtrinsicFailedEvent,
  SystemExtrinsicFailedEvent,
} from "../frame_metadata/mod.ts"
import { known } from "../rpc/mod.ts"
import { is, OrthoRune, Run, Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { BlockHashRune } from "./BlockHashRune.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { PatternRune } from "./PatternRune.ts"
import { SignedExtrinsicRune } from "./SignedExtrinsicRune.ts"

export class ExtrinsicStatusRune<out C extends Chain, out U1, out U2>
  extends PatternRune<Run<known.TransactionStatus, U1>, C, U2, SignedExtrinsicRune<C, U2>>
{
  dbgStatus<X>(...prefix: RunicArgs<X, unknown[]>): ExtrinsicStatusRune<C, U1, U2> {
    return this
      .into(OrthoRune)
      .orthoMap((rune) => rune.dbg(...prefix))
      .into(ExtrinsicStatusRune, this.chain, this.parent)
  }

  statuses(isTerminal: (txStatus: known.TransactionStatus) => boolean) {
    return this
      .into(OrthoRune)
      .orthoMap((events) => events.into(ValueRune).filter(isTerminal))
      .flatSingular()
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

  inBlockEvents<P extends Chain.PalletName<C>, N extends Chain.RuntimeEventName<C, P>, X>(
    ...[palletName, eventName]: RunicArgs<X, [palletName?: P, eventName?: N]>
  ) {
    return Rune
      .tuple([this.events(this.inBlock().block()), palletName, eventName])
      .map(([events, palletName, eventName]) =>
        (typeof palletName === "string"
          ? ((events as Event[]).filter((event): event is Chain.Event<C, P, N> =>
            event.event.type === palletName && event.event.value.type === eventName
          ))
          : events) as Chain.Event<C, P, N>[]
      )
  }
  finalizedEvents<P extends Chain.PalletName<C>, N extends Chain.RuntimeEventName<C, P>, X>(
    ...[palletName, eventName]: RunicArgs<X, [palletName?: P, eventName?: N]>
  ) {
    return Rune
      .tuple([this.events(this.finalized().block()), palletName, eventName])
      .map(([events, palletName, eventName]) =>
        (typeof palletName === "string"
          ? ((events as Event[]).filter((event): event is Chain.Event<C, P, N> =>
            event.event.type === palletName && event.event.value.type === eventName
          ))
          : events) as Chain.Event<C, P, N>[]
      )
  }

  private events<EU>(block: BlockRune<C, EU>) {
    const txI = Rune
      .tuple([block.into(ValueRune).access("block", "extrinsics"), this.parent.hex()])
      .map(([hexes, hex]) => {
        const i = hexes.indexOf("0x" + hex)
        return i === -1 ? undefined : i
      })
      .unhandle(is(undefined))
    return Rune
      .tuple([block.events(), txI])
      .into(ValueRune)
      .map(([events, txI]) =>
        events.filter((event) => event.phase.type === "ApplyExtrinsic" && event.phase.value === txI)
      )
      .rehandle(is(undefined), () => Rune.constant([]))
      .unsafeAs<Chain.Event<C>[]>()
  }

  // TODO: turn into `errors` and perform decoding for all (?)... or should there only ever be one?
  error() {
    return this
      .inBlockEvents()
      .map((events) => events.find(isSystemExtrinsicFailedEvent))
      .unhandle(is(undefined))
      .unsafeAs<SystemExtrinsicFailedEvent>()
      .into(ValueRune)
      .access("event", "value", "dispatchError")
      .match((_) =>
        _
          .when(
            (value: DispatchError): value is Extract<DispatchError, string> =>
              typeof value === "string",
            (value) => value,
          )
          .else((value) =>
            Rune
              .tuple([
                this.chain.metadata.into(ValueRune).access("pallets"),
                value.access("value", "index"),
              ])
              .map(([pallets, id]) => Object.values(pallets).find((pallet) => pallet.id === id)!)
              .access("types", "error")
              .unhandle(is(undefined))
              .into(CodecRune)
              .decoded(value.access("value", "error"))
          )
      )
  }
}

export class NeverInBlockError extends Error {}
export class NeverFinalizedError extends Error {}
