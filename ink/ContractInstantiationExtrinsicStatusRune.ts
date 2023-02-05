import { Chain, ExtrinsicStatusRune, PublicKeyRune } from "../fluent/mod.ts"
import { ValueRune } from "../rune/mod.ts"
import { ContractInstanceRune } from "./ContractInstanceRune.ts"

export class ContractInstantiationExtrinsicStatusRune<out U1, out U2, out C extends Chain = Chain>
  extends ExtrinsicStatusRune<U1, U2, C>
{
  override logStatus(...prefix: unknown[]) {
    return super
      .logStatus(...prefix)
      .into(ContractInstantiationExtrinsicStatusRune, this.extrinsic)
  }

  publicKey() {
    const finalized = this.finalized()
    return finalized
      .events()
      .into(ValueRune)
      .map((events) => {
        const event = events.find(({ event }) =>
          event.type === "Contracts" && event.value.type === "Instantiated"
        )
        if (!event) return new FailedToFindContractAddressError()
        const { value } = event.event
        if ("contract" in value) return value.contract as Uint8Array
        return new FailedToFindContractAddressError()
      })
      .unhandle(FailedToFindContractAddressError)
      .into(PublicKeyRune)
  }

  address() {
    return this.publicKey().address(this.extrinsic.client)
  }

  instance() {
    return this.publicKey().into(ContractInstanceRune, this.extrinsic.client)
  }
}

export class FailedToFindContractAddressError extends Error {
  override readonly name = "FailedToFindContractAddressError"
}
