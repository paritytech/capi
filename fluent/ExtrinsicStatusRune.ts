import { known } from "../rpc/mod.ts"
import { MetaRune, Rune, ValueRune } from "../rune/mod.ts"
import { Chain } from "./ClientRune.ts"
import { InBlockBlockRune } from "./InBlockBlockRune.ts"
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
    const hash = this.terminalTransactionStatuses()
      .map((status) =>
        typeof status !== "string" && status.inBlock ? status.inBlock : new NeverInBlockError()
      )
      .singular()
      .unhandle(NeverInBlockError)
    return this.extrinsic.client
      .block(hash)
      .into(InBlockBlockRune, this.extrinsic.client, hash)
  }

  finalized() {
    const hash = this.terminalTransactionStatuses()
      .map((status) =>
        typeof status !== "string" && status.finalized
          ? status.finalized
          : new NeverFinalizedError()
      )
      .singular()
      .unhandle(NeverFinalizedError)
    return this.extrinsic.client.block(hash)
  }
}

export class NeverFinalizedError extends Error {}
export class NeverInBlockError extends Error {}
