import { known } from "../rpc/mod.ts"
import { MetaRune, Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain } from "./ChainRune.ts"
import { EventPhase, HasSystemEvents } from "./constraints.ts"
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

  inBlock() {
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

  finalized() {
    const x = this.finalizedHash()
    return this.chain.block(x)
  }

  inBlockEvents() {
    return this.events(this.inBlock())
  }

  finalizedEvents() {
    return this.events(this.finalized())
  }

  events<EU>(block: BlockRune<Chain.Req<C, HasSystemEvents>, EU>) {
    const txI = Rune
      .tuple([block.into(ValueRune).access("block", "extrinsics"), this.parent.hex()])
      .map(([hexes, hex]) => {
        const i = hexes.indexOf("0x" + hex)
        return i === -1 ? undefined : i
      })
    return Rune
      .tuple([block.events(), txI])
      .map(([events, txI]) =>
        events.filter((event) =>
          EventPhase.isApplyExtrinsicEvent(event) && event.phase.value === txI
        )
      )
      .into(ExtrinsicEventsRune, this.chain)
  }
}

export class NeverInBlockError extends Error {}
export class NeverFinalizedError extends Error {}
