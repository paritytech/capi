import { known } from "../rpc/mod.ts"
import { is, OrthoRune, Run, Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { BlockHashRune } from "./BlockHashRune.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain } from "./ChainRune.ts"
import { ExtrinsicEventsRune } from "./ExtrinsicsEventsRune.ts"
import { PatternRune } from "./PatternRune.ts"
import { SignedExtrinsicRune } from "./SignedExtrinsicRune.ts"

/** A rune representing the state of a sent signed extrinsic */
export class ExtrinsicStatusRune<out C extends Chain, out U1, out U2>
  extends PatternRune<Run<known.TransactionStatus, U1>, C, U2, SignedExtrinsicRune<C, U2>>
{
  /** Get this rune, but with incoming statuses `console.log`ged */
  dbgStatus<X>(...prefix: RunicArgs<X, unknown[]>): ExtrinsicStatusRune<C, U1, U2> {
    return this
      .into(OrthoRune)
      .orthoMap((rune) => rune.dbg(...prefix))
      .into(ExtrinsicStatusRune, this.chain, this.parent)
  }

  private statuses(isTerminal: (status: known.TransactionStatus) => boolean) {
    return this
      .into(OrthoRune)
      .orthoMap((events) => events.into(ValueRune).filter(isTerminal))
      .flatSingular()
  }

  /** Get the hash of the block in which the extrinsic is included */
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

  /** Get the hash of the block in which the extrinsic is finalized */
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

  /** Get the events of the in-block block */
  inBlockEvents() {
    return this.events(this.inBlock().block())
  }

  /** Get the events of the finalized block */
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
      .unsafeAs<any>()
      .into(ValueRune)
      .map(([events, txI]: [any[], number]) =>
        // TODO: narrow
        events.filter((event: any) =>
          event.phase.type === "ApplyExtrinsic" && event.phase.value === txI
        )
      )
      .rehandle(is(undefined), () => Rune.constant([]))
      .unsafeAs<any>()
      .into(ExtrinsicEventsRune, this.chain)
  }
}

/** An error describing cases in which the extrinsic does not get included in a block before a terminal status */
export class NeverInBlockError extends Error {
  override readonly name = "NeverInBlockError"
}

/** An error describing cases in which the extrinsic does not get finalized before a terminal status */
export class NeverFinalizedError extends Error {
  override readonly name = "NeverFinalizedError"
}
