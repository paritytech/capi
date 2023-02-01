import * as $ from "../deps/scale.ts"
import * as bytes from "../deps/std/bytes.ts"
import * as ink from "../ink_metadata/mod.ts"
import { MultiAddress, Signer } from "../primitives/mod.ts"
import { Client } from "../rpc/mod.ts"
import * as rpc from "../rpc/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { DeriveCodec } from "../scale_info/mod.ts"
import * as U from "../util/mod.ts"
import { Chain, ClientRune } from "./client.ts"
import { ExtrinsicRune, SignedExtrinsicProps } from "./extrinsic.ts"
import { state } from "./rpc_known_methods.ts"

export interface InkContract {
  metadataRaw: string
}

export interface InkContractInstantiateProps {
  initiator: Uint8Array
  code: Uint8Array
  ctor?: string
}

export class InkContractRune<out U, out C extends Chain = Chain> extends Rune<InkContract, U> {
  private pallet
  metadata
  ctors

  constructor(_prime: InkContractRune<U>["_prime"], readonly client: ClientRune<U, C>) {
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

  salt() {
    return crypto.getRandomValues(new Uint8Array(4))
  }

  // TODO: create instantiation-specific rune so that we can `.address()` from it
  instantiate<X>(props: RunicArgs<X, InkContractInstantiateProps>) {
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
          this.salt(),
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
        .map(([code, ctor, gasRequired]) => ({
          type: "Contracts",
          value: {
            type: "instantiateWithCode",
            value: 0n,
            gasLimit: gasRequired,
            storageDepositLimit: undefined,
            code,
            data: U.hex.decode(ctor.selector),
            salt: this.salt(),
          },
        })),
    )
  }

  declare fromAddress: <X>(
    ...[address]: RunicArgs<X, [address: Uint8Array]>
  ) => InkContractInstanceRune<U>
}

export class InkContractInstanceRune<out U, out C extends Chain = Chain>
  extends Rune<Uint8Array, U>
{
  constructor(_prime: InkContractInstanceRune<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }

  declare msg: <X>(
    ...[method, ...args]: RunicArgs<X, [method: string, ...args: unknown[]]>
  ) => InkContractMsg<U>
}

export class InkContractMsg<out U, out C extends Chain = Chain> extends Rune<Uint8Array, U> {
  constructor(_prime: InkContractMsg<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }

  declare signed: <X>(props: RunicArgs<X, SignedExtrinsicProps>) => InkContractMsgSigned<U>
}

export class InkContractMsgSigned<out U, out C extends Chain = Chain> extends Rune<Uint8Array, U> {
  constructor(_prime: InkContractMsgSigned<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }
}

export class InkContractMetadataInvalidError extends Error {
  override readonly name = "InkContractMetadataInvalidError"
}
