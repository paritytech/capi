import { Chain, ClientRune, state } from "../../fluent/mod.ts"
import { Client } from "../../rpc/client.ts"
import { Rune, RunicArgs, ValueRune } from "../../rune/mod.ts"
import { hex } from "../../util/mod.ts"
import { $contractsApiInstantiateArgs, $contractsApiInstantiateResult } from "./codecs.ts"
import { ContractInstantiationExtrinsicRune } from "./ContractInstantiationExtrinsicRune.ts"
import { Constructor, normalize } from "./ContractMetadata.ts"

export class ContractRune<out U, out C extends Chain = Chain> extends Rune<string, U> {
  constructor(_prime: ContractRune<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }

  static from<X>(...[client, jsonText]: RunicArgs<X, [client: Client, jsonText: string]>) {
    return Rune
      .resolve(jsonText)
      .into(ContractRune, Rune.resolve(client).into(ClientRune))
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

  instantiate<X>(
    ...args: RunicArgs<X, [code: Uint8Array, initiator: Uint8Array, ctorLabel?: string]>
  ) {
    const [code, initiator, ctorLabel] = args
    const ctor = this.ctor(ctorLabel)
    const key = Rune.tuple([code, initiator, ctor])
      .map(([code, initiator, ctor]) =>
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
      .tuple([code, ctor, gasRequired])
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
