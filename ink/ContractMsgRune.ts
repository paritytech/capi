import { Chain, ClientRune, SignedExtrinsicProps } from "../fluent/mod.ts"
import { Rune, RunicArgs } from "../rune/mod.ts"
import { ContractMsgSigned } from "./ContractMsgSignedRune.ts"

export class ContractMsgRune<out U, out C extends Chain = Chain> extends Rune<Uint8Array, U> {
  constructor(_prime: ContractMsgRune<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }

  declare signed: <X>(props: RunicArgs<X, SignedExtrinsicProps>) => ContractMsgSigned<U>
}
