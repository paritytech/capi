import { known } from "../rpc/mod.ts"
import { MetaRune, Rune, ValueRune } from "../rune/mod.ts"
import { Chain } from "./ClientRune.ts"
import { FinalizedBlockHashRune } from "./FinalizedBlockHashRune.ts"
import { InBlockBlockHashRune } from "./InBlockBlockHashRune.ts"
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

  logStatus(...prefix: unknown[]): ExtrinsicStatusRune<U1, U2, C> {
    return this.into(ValueRune).map((rune) =>
      rune.into(ValueRune).map((value) => {
        console.log(...prefix, value)
        return value
      })
    ).into(ExtrinsicStatusRune<U1, U2, C>, this.extrinsic)
  }

  terminalTransactionStatuses() {
    return this.into(MetaRune).flatMap((events) =>
      events
        .into(ValueRune)
        .filter(known.TransactionStatus.isTerminal)
    )
  }

  inBlock() {
    return this.terminalTransactionStatuses()
      .map((status) =>
        typeof status !== "string" && status.inBlock ? status.inBlock : new NeverInBlockError()
      )
      .singular()
      .unhandle(NeverInBlockError)
      .into(InBlockBlockHashRune, this.extrinsic.client)
  }

  finalized() {
    return this.terminalTransactionStatuses()
      .map((status) =>
        typeof status !== "string" && status.finalized
          ? status.finalized
          : new NeverFinalizedError()
      )
      .singular()
      .unhandle(NeverFinalizedError)
      .into(FinalizedBlockHashRune, this.extrinsic.client)
  }
}

export class NeverFinalizedError extends Error {}
export class NeverInBlockError extends Error {}
