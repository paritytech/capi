import { known } from "../rpc/mod.ts"
import { Rune } from "../rune/mod.ts"
import { Chain, ClientRune } from "./client.ts"

// TODO: extract from extrinsic
export class TransactionStatusesRune<out U, out C extends Chain = Chain>
  extends Rune<known.TransactionStatus, U>
{
  constructor(_prime: TransactionStatusesRune<U, C>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }
}
