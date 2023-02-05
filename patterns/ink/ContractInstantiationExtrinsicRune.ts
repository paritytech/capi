import { Chain, ClientRune, ExtrinsicRune, SignedExtrinsicProps } from "../../fluent/mod.ts"
import { RunicArgs } from "../../rune/mod.ts"
import { ContractInstantiationSignedExtrinsicRune } from "./ContractInstantiationSignedExtrinsicRune.ts"
import { ContractRune } from "./ContractRune.ts"

export class ContractInstantiationExtrinsicRune<out U, out C extends Chain = Chain>
  extends ExtrinsicRune<U, C>
{
  constructor(
    _prime: ExtrinsicRune<U, C>["_prime"],
    client: ClientRune<U, C>,
    readonly contract: ContractRune<U>,
  ) {
    super(_prime, client)
  }

  override signed<X>(props: RunicArgs<X, SignedExtrinsicProps>) {
    return super
      .signed(props)
      .into(ContractInstantiationSignedExtrinsicRune, this.client, this.contract)
  }
}
