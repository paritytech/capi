import { known } from "../rpc/mod.ts"
import { is, MetaRune, Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { BlockHashRune } from "./BlockHashRune.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain } from "./ChainRune.ts"
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

  inBlock() {
    return this.transactionStatuses((status) =>
      known.TransactionStatus.isTerminal(status)
      || (typeof status !== "string" ? !!status.inBlock : false)
    )
      .map((status) =>
        typeof status !== "string" && status.inBlock ? status.inBlock : new NeverInBlockError()
      )
      .singular()
      .unhandle(is(NeverInBlockError))
      .into(BlockHashRune, this.chain)
  }

  finalized() {
    return this.transactionStatuses(known.TransactionStatus.isTerminal)
      .map((status) =>
        typeof status !== "string" && status.finalized
          ? status.finalized
          : new NeverFinalizedError()
      )
      .singular()
      .unhandle(is(NeverFinalizedError))
      .into(BlockHashRune, this.chain)
  }

  inBlockEvents() {
    return this.events(this.inBlock().block())
  }

  finalizedEvents() {
    return this.events(this.finalized().block())
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
      .map(([events, txI]) =>
        // TODO: narrow
        events.filter((event: any) =>
          event.phase.type === "ApplyExtrinsic" && event.phase.value === txI
        )
      )
      .rehandle(is(undefined), () => Rune.constant([]))
      .into(ExtrinsicEventsRune, this.chain)
  }
}

export class NeverInBlockError extends Error {}
export class NeverFinalizedError extends Error {}
