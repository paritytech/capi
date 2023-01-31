import * as $ from "../deps/scale.ts"
import * as bytes from "../deps/std/bytes.ts"
import * as ink from "../ink_metadata/mod.ts"
import { MultiAddress, Signer } from "../primitives/mod.ts"
import { Client } from "../rpc/mod.ts"
import * as rpc from "../rpc/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { DeriveCodec } from "../scale_info/mod.ts"
import * as U from "../util/mod.ts"
import { ClientRune } from "./client.ts"
import { ExtrinsicRune } from "./extrinsic.ts"
import { state } from "./rpc_known_methods.ts"

export interface InkContract {
  metadataRaw: string
}

export interface InstantiateProps {
  initiator: Uint8Array
  code: Uint8Array
  ctor?: string
}

export class InkContractRune<out U> extends Rune<InkContract, U> {
  private pallet
  metadata
  ctors

  constructor(_prime: InkContractRune<U>["_prime"], readonly client: ClientRune<U>) {
    super(_prime)
    this.pallet = this.client.metadata().pallet("Contracts")
    this.metadata = this.as(ValueRune).map((x) => ink.normalize(JSON.parse(x.metadataRaw)))
    this.ctors = this.metadata.map(({ V3: { spec: { constructors } } }) =>
      constructors.reduce<Record<string, ink.Constructor | undefined>>(
        (acc, cur) => ({ ...acc, [cur.label]: cur }),
        {},
      )
    )
  }

  ctor<X>(...[ctorLabel]: RunicArgs<X, [string?]>) {
    return Rune
      .tuple([this.ctors, ctorLabel])
      .map(([ctors, ctorLabel]) => {
        const maybeCtor = ctors[ctorLabel ?? "default"]
        if (!maybeCtor) return new InkContractMetadataInvalidError()
        return maybeCtor
      })
      .unwrapError()
  }

  instantiate<X>(props: RunicArgs<X, InstantiateProps>) {
    const ctor = this.ctor(props.ctor)
    const key = Rune.tuple([Rune.rec(props), ctor])
      .map(([{ code, initiator }, ctor]) =>
        U.hex.encode(ink.$contractsApiInstantiateArgs.encode([
          initiator,
          0n,
          undefined,
          undefined,
          { type: "Upload", value: code },
          U.hex.decode(ctor.selector),
          SALT,
        ]))
      )
    const gasRequired = state
      .call(this.client, "ContractsApi_instantiate", key)
      .unwrapError()
      .unwrapNull()
      .map((result) => ink.$contractsApiInstantiateResult.decode(U.hex.decode(result)))
      .access("gasRequired")
    return this.client.extrinsic(
      Rune
        .tuple([props.code, ctor, gasRequired])
        .unwrapError()
        .unwrapNull()
        .unwrapUndefined()
        .map(([code, ctor, gasRequired]) => ({
          type: "Contracts",
          value: {
            type: "instantiateWithCode",
            value: 0n,
            gasLimit: gasRequired,
            storageDepositLimit: undefined,
            code,
            data: U.hex.decode(ctor.selector),
            salt: SALT,
          },
        })),
    )
  }

  // call<X>(props: RunicArgs<X, {}>) {}
  // callTx<X>(props: RunicArgs<X, {}>) {}
}

export class InkContractInstanceRune<out U> extends Rune<Uint8Array, U> {}

export class InkContractMetadataInvalidError extends Error {
  override readonly name = "InkContractMetadataInvalidError"
}

// TODO: how is this determined?
const SALT = Uint8Array.from(Array.from([0, 0, 0, 0]), () => Math.floor(Math.random() * 16))
