import { Chain, ClientRune, state } from "../fluent/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { hex } from "../util/mod.ts"
import { $contractsApiInstantiateArgs, $contractsApiInstantiateResult } from "./codecs.ts"
import { ContractInstantiationExtrinsicRune } from "./ContractInstantiationExtrinsicRune.ts"
import { Constructor, normalize } from "./ContractMetadata.ts"

export interface InstantiateProps {
  initiator: Uint8Array
  code: Uint8Array
  ctor?: string
}

export class ContractRune<out U, out C extends Chain = Chain> extends Rune<string, U> {
  constructor(_prime: ContractRune<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }

  metadata() {
    return this
      .into(ValueRune)
      .map((metadataRaw) => normalize(JSON.parse(metadataRaw)))
  }

  ctors() {
    return this.metadata().map(({ V3: { spec: { constructors } } }) =>
      constructors.reduce<Record<string, Constructor | undefined>>(
        (acc, cur) => ({ ...acc, [cur.label]: cur }),
        {},
      )
    )
  }

  ctor<X>(...[ctorLabel]: RunicArgs<X, [string?]>) {
    return Rune
      .tuple([this.ctors(), ctorLabel])
      .map(([ctors, ctorLabel]) => {
        const maybeCtor = ctors[ctorLabel ?? "default"]
        if (!maybeCtor) return new ContractMetadataInvalidError()
        return maybeCtor
      })
      .unhandle(ContractMetadataInvalidError)
  }

  salt() {
    return crypto.getRandomValues(new Uint8Array(4))
  }

  instantiate<X>(props: RunicArgs<X, InstantiateProps>) {
    const ctor = this.ctor(props.ctor)
    const key = Rune.tuple([Rune.rec(props), ctor])
      .map(([{ code, initiator }, ctor]) =>
        hex.encode($contractsApiInstantiateArgs.encode([
          initiator,
          0n,
          undefined,
          undefined,
          { type: "Upload", value: code },
          hex.decode(ctor.selector),
          this.salt(),
        ]))
      )
    const gasRequired = state
      .call(this.client, "ContractsApi_instantiate", key)
      .map((result) => $contractsApiInstantiateResult.decode(hex.decode(result)))
      .access("gasRequired")
    return Rune
      .tuple([props.code, ctor, gasRequired])
      .map(([code, ctor, gasRequired]) => ({
        type: "Contracts",
        value: {
          type: "instantiateWithCode",
          value: 0n,
          gasLimit: gasRequired,
          storageDepositLimit: undefined,
          code,
          data: hex.decode(ctor.selector),
          salt: this.salt(),
        },
      }))
      .into(ContractInstantiationExtrinsicRune, this.client)
  }
}

export class ContractMetadataInvalidError extends Error {
  override readonly name = "ContractMetadataInvalidError"
}
