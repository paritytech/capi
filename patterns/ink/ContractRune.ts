import * as $ from "../../deps/scale.ts"
import { Chain, ClientRune, CodecRune, state } from "../../fluent/mod.ts"
import { Client } from "../../rpc/client.ts"
import { ArrayRune, Rune, RunicArgs } from "../../rune/mod.ts"
import { hex } from "../../util/mod.ts"
import { $contractsApiInstantiateArgs, $contractsApiInstantiateResult, Weight } from "./codecs.ts"
import { ContractInstantiationExtrinsicRune } from "./ContractInstantiationExtrinsicRune.ts"
import { Metadata, normalize } from "./ContractMetadata.ts"
import { ContractMetadataRune } from "./ContractMetadataRune.ts"

// TODO: `onInstantiated`
export interface ContractInstantiateProps {
  code: Uint8Array
  origin: Uint8Array
  value?: bigint
  ctor?: string
  args?: unknown[]
  gasLimit?: Weight
  storageDepositLimit?: bigint
  salt?: Uint8Array
}

export class ContractRune<out U, out C extends Chain = Chain> extends Rune<Metadata, U> {
  metadata

  constructor(_prime: ContractRune<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
    this.metadata = this.into(ContractMetadataRune)
  }

  static from<X>(...[client, jsonText]: RunicArgs<X, [client: Client, jsonText: string]>) {
    return Rune
      .resolve(jsonText)
      .map((jsonText) => normalize(JSON.parse(jsonText)))
      .into(ContractRune, Rune.resolve(client).into(ClientRune))
  }

  salt() {
    return Rune.constant(crypto.getRandomValues(new Uint8Array(4)))
  }

  instantiate<X>(props: RunicArgs<X, ContractInstantiateProps>) {
    const { code } = props
    const salt = Rune
      .resolve(props.salt)
      .unhandle(undefined)
      .handle(undefined, this.salt)
    const storageDepositLimit = Rune.resolve(props.storageDepositLimit)
    const value = Rune
      .resolve(props.value)
      .unhandle(undefined)
      .handle(undefined, () => Rune.constant(0n))
    const ctor = this.metadata.ctor(props.ctor)
    const selector = ctor.access("selector").map(hex.decode)
    const selectorLength = selector.map((v) => v.length)
    const argCodecs = ctor
      .access("args")
      .into(ArrayRune)
      .mapArray((arg) =>
        Rune
          .tuple([this.metadata.deriveCodec, arg.access("type").access("type")])
          .map(([deriveCodec, i]) => deriveCodec(i))
      )
    const $data = Rune
      .tuple([selectorLength, argCodecs])
      .map(([selectorLength, argCodecs]) =>
        $.tuple($.sizedUint8Array(selectorLength), ...argCodecs)
      )
      .into(CodecRune)
      .encoded(
        Rune
          .tuple([selector, props.args])
          .map(([selector, args]) => [selector, ...args ?? []]),
      )
    const data = Rune
      .tuple([
        props.origin,
        value,
        undefined,
        storageDepositLimit,
        Rune.rec({ type: "Upload" as const, value: code }),
        $data,
        salt,
      ])
      .map((b) => $contractsApiInstantiateArgs.encode(b))
    const gasLimit = props.gasLimit ?? state
      .call(this.client, "ContractsApi_instantiate", data.map(hex.encode))
      .map((result) => $contractsApiInstantiateResult.decode(hex.decode(result)))
      .access("gasRequired")
    return Rune
      .rec({
        type: "Contracts" as const,
        value: Rune.rec({
          type: "instantiateWithCode",
          value,
          gasLimit,
          storageDepositLimit,
          code,
          data,
          salt,
        }),
      })
      .into(ContractInstantiationExtrinsicRune, this.client, this)
  }
}
