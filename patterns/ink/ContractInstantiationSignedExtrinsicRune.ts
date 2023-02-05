import { Chain, ClientRune, SignedExtrinsicRune } from "../../fluent/mod.ts"
import { ContractInstantiationExtrinsicStatusRune } from "./ContractInstantiationExtrinsicStatusRune.ts"
import { ContractRune } from "./ContractRune.ts"

export class ContractInstantiationSignedExtrinsicRune<out U, out C extends Chain = Chain>
  extends SignedExtrinsicRune<U, C>
{
  constructor(
    _prime: SignedExtrinsicRune<U>["_prime"],
    client: ClientRune<U, C>,
    readonly contract: ContractRune<U>,
  ) {
    super(_prime, client)
  }

  override sent() {
    const sent = super.sent()
    return sent.into(ContractInstantiationExtrinsicStatusRune, sent.extrinsic, this.contract)
  }
}
