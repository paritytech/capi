// TODO: remove
// deno-lint-ignore-file
import * as ink from "../ink_metadata/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import * as U from "../util/mod.ts"
import { Chain, ClientRune } from "./ClientRune.ts"
import { ExtrinsicRune, SignedExtrinsicProps } from "./ExtrinsicRune.ts"
import { ExtrinsicStatusRune } from "./ExtrinsicStatusRune.ts"
import { state } from "./rpc_method_runes.ts"
import { SignedExtrinsicRune } from "./SignedExtrinsicRune.ts"

export interface InkContractInstantiateProps {
  initiator: Uint8Array
  code: Uint8Array
  ctor?: string
}

export class InkContractRune<out U, out C extends Chain = Chain> extends Rune<string, U> {
  metadata
  ctors

  constructor(_prime: InkContractRune<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
    this.metadata = this
      .into(ValueRune)
      .map((metadataRaw) => ink.normalize(JSON.parse(metadataRaw)))
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
      .unhandle(InkContractMetadataInvalidError)
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
      .map((result) => ink.$contractsApiInstantiateResult.decode(U.hex.decode(result)))
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
          data: U.hex.decode(ctor.selector),
          salt: this.salt(),
        },
      }))
      .into(ContractInstantiationExtrinsicRune, this.client)
  }
}

export class ContractInstantiationExtrinsicRune<out U, out C extends Chain = Chain>
  extends ExtrinsicRune<U, C>
{
  override signed<X>(props: RunicArgs<X, SignedExtrinsicProps>) {
    return super.signed(props).into(ContractInstantiationSignedExtrinsicRune, this.client)
  }
}

export class ContractInstantiationSignedExtrinsicRune<out U, out C extends Chain = Chain>
  extends SignedExtrinsicRune<U, C>
{
  override sent() {
    return super.sent().into(
      ContractInstantiationExtrinsicStatusRune,
      this.into(SignedExtrinsicRune, this.client),
    )
  }
}

export class ContractInstantiationExtrinsicStatusRune<out U1, out U2, out C extends Chain = Chain>
  extends ExtrinsicStatusRune<U1, U2, C>
{
  override logStatus(...prefix: unknown[]) {
    return super
      .logStatus(...prefix)
      .into(ContractInstantiationExtrinsicStatusRune, this.extrinsic)
  }

  address() {
    // return this
    //   .events()
    //   .into(ValueRune)
    //   .map((a) =>
    //     a.find(({ event }) => event.type === "Contracts" && event.value.type === "Instantiated")
    //   )
  }
}

// function isEvent(event: unknown, pallet: string, name: string) {
//   return typeof event === "object" && event !== null && "type" in event && event.type === "System"
//     && "value" in event && typeof event.value === "object" && event.value !== null
//     && "type" in event.value
// }

// export class InkContractInstanceRune<out U, out C extends Chain = Chain>
//   extends Rune<Uint8Array, U>
// {
//   constructor(_prime: InkContractInstanceRune<U>["_prime"], readonly client: ClientRune<U, C>) {
//     super(_prime)
//   }

//   declare msg: <X>(
//     ...[method, ...args]: RunicArgs<X, [method: string, ...args: unknown[]]>
//   ) => InkContractMsg<U>
// }

// export class InkContractMsg<out U, out C extends Chain = Chain> extends Rune<Uint8Array, U> {
//   constructor(_prime: InkContractMsg<U>["_prime"], readonly client: ClientRune<U, C>) {
//     super(_prime)
//   }

//   declare signed: <X>(props: RunicArgs<X, SignedExtrinsicProps>) => InkContractMsgSigned<U>
// }

// export class InkContractMsgSigned<out U, out C extends Chain = Chain> extends Rune<Uint8Array, U> {
//   constructor(_prime: InkContractMsgSigned<U>["_prime"], readonly client: ClientRune<U, C>) {
//     super(_prime)
//   }
// }

export class InkContractMetadataInvalidError extends Error {
  override readonly name = "InkContractMetadataInvalidError"
}
