import { known } from "../rpc/mod.ts"
import { MetaRune, Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { BlockRune } from "./BlockRune.ts"
import { Chain } from "./ChainRune.ts"
import { ExtrinsicEventsRune } from "./ExtrinsicsEventsRune.ts"
import { SignedExtrinsicRune } from "./SignedExtrinsicRune.ts"

export class ExtrinsicStatusRune<out U1, out U2, out C extends Chain = Chain>
  extends Rune<Rune<known.TransactionStatus, U1>, U2>
{
  constructor(
    _prime: ExtrinsicStatusRune<U1, U2, C>["_prime"],
    readonly extrinsic: SignedExtrinsicRune<U2, C>,
  ) {
    super(_prime)
  }

  dbgStatus<X>(...prefix: RunicArgs<X, unknown[]>): ExtrinsicStatusRune<U1, U2, C> {
    return this
      .into(ValueRune)
      .map((rune) => rune.into(ValueRune).dbg(...prefix))
      .into(ExtrinsicStatusRune, this.extrinsic)
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
    return this.extrinsic.chain.block(this.inBlockHash())
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
    return this.extrinsic.chain.block(this.finalizedHash())
  }

  inBlockEvents() {
    return this.events(this.inBlock())
  }

  finalizedEvents() {
    return this.events(this.finalized())
  }

  events<EU>(block: BlockRune<EU, C>) {
    const txI = Rune
      .tuple([block.into(ValueRune).access("block", "extrinsics"), this.extrinsic.hex()])
      .map(([hexes, hex]) => {
        const i = hexes.indexOf("0x" + hex)
        return i === -1 ? undefined : i
      })
    return Rune
      .tuple([block.events(), txI])
      .map(([events, txI]) =>
        events.filter((event) => event.phase.type === "ApplyExtrinsic" && event.phase.value === txI)
      )
      .into(ExtrinsicEventsRune, this.extrinsic.chain)
  }
}

export class NeverInBlockError extends Error {}
export class NeverFinalizedError extends Error {}
