import { Chain, ClientRune } from "../fluent/mod.ts"
import { Rune, RunicArgs } from "../rune/mod.ts"
import { ContractMsgRune } from "./ContractMsgRune.ts"

export class ContractInstanceRune<out U, out C extends Chain = Chain> extends Rune<Uint8Array, U> {
  constructor(_prime: ContractInstanceRune<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }

  declare msg: <X>(
    ...[method, ...args]: RunicArgs<X, [method: string, ...args: unknown[]]>
  ) => ContractMsgRune<U>
}
