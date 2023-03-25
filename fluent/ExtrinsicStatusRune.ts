import { known } from "../rpc/mod.ts"
import { MetaRune, Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain } from "./ChainRune.ts"
import { EventsChain } from "./EventsRune.ts"
import { ExtrinsicEventsRune } from "./ExtrinsicsEventsRune.ts"
import { PatternRune } from "./PatternRune.ts"
import { SignedExtrinsicRune } from "./SignedExtrinsicRune.ts"

export class ExtrinsicStatusRune<out C extends Chain, out U1, out U2>
  extends PatternRune<Rune<known.TransactionStatus, U1>, C, U2, SignedExtrinsicRune<C, U2>>
{
  dbgStatus<X>(...prefix: RunicArgs<X, unknown[]>): ExtrinsicStatusRune<C, U1, U2> {
    return this
      .into(ValueRune)
      .map((rune) => rune.into(ValueRune).dbg(...prefix))
      .into(ExtrinsicStatusRune, this.chain, this.parent)
  }

  transactionStatuses(isTerminal: (txStatus: known.TransactionStatus) => boolean) {
    return this
      .into(MetaRune)
      .flatMap((events) => events.into(ValueRune).filter(isTerminal))
  }

  inBlockHash() {
    return this.transactionStatuses((status) =>
      known.TransactionStatus.isTerminal(status)
      || (typeof status !== "string" ? !!status.inBlock : false)
    )
      .map((status) =>
        typeof status !== "string" && status.inBlock ? status.inBlock : new NeverInBlockError()
      )
      .singular()
      .unhandle(NeverInBlockError)
  }

  inBlockBlock() {
    return this.chain.block(this.inBlockHash())
  }

  finalizedHash() {
    return this.transactionStatuses(known.TransactionStatus.isTerminal)
      .map((status) =>
        typeof status !== "string" && status.finalized
          ? status.finalized
          : new NeverFinalizedError()
      )
      .singular()
      .unhandle(NeverFinalizedError)
  }

  finalizedBlock() {
    return this.chain.block(this.finalizedHash())
  }

  inBlockEvents(this: ExtrinsicStatusRune<EventsChain<C>, U1, U2>) {
    return this.events(this.inBlockBlock())
  }

  finalizedEvents(this: ExtrinsicStatusRune<EventsChain<C>, U1, U2>) {
    return this.events(this.finalizedBlock())
  }

  events<EU>(
    this: ExtrinsicStatusRune<EventsChain<C>, U1, U2>,
    block: BlockRune<EventsChain<C>, EU>,
  ) {
    const txI = Rune
      .tuple([block.into(ValueRune).access("block", "extrinsics"), this.parent.hex()])
      .map(([hexes, hex]) => {
        const i = hexes.indexOf("0x" + hex)
        return i === -1 ? undefined : i
      })
    return Rune
      .tuple([block.events(), txI])
      .map(([events, txI]) =>
        events.filter((event) => event.phase.type === "ApplyExtrinsic" && event.phase.value === txI)
      )
      .into(ExtrinsicEventsRune, this.chain)
  }
}

export class NeverInBlockError extends Error {}
export class NeverFinalizedError extends Error {}
