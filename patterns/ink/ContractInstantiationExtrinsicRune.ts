import { Chain, ExtrinsicRune, SignedExtrinsicProps } from "../../fluent/mod.ts"
import { RunicArgs } from "../../rune/mod.ts"
import { ContractInstantiationSignedExtrinsicRune } from "./ContractInstantiationSignedExtrinsicRune.ts"

export class ContractInstantiationExtrinsicRune<out U, out C extends Chain = Chain>
  extends ExtrinsicRune<U, C>
{
  override signed<X>(props: RunicArgs<X, SignedExtrinsicProps>) {
    return super.signed(props).into(ContractInstantiationSignedExtrinsicRune, this.client)
  }
}
