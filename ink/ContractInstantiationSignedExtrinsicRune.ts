import { Chain, SignedExtrinsicRune } from "../fluent/mod.ts"
import { ContractInstantiationExtrinsicStatusRune } from "./ContractInstantiationExtrinsicStatusRune.ts"

export class ContractInstantiationSignedExtrinsicRune<out U, out C extends Chain = Chain>
  extends SignedExtrinsicRune<U, C>
{
  override sent() {
    const sent = super.sent()
    return sent.into(ContractInstantiationExtrinsicStatusRune, sent.extrinsic)
  }
}
