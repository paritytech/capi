import * as $ from "../../deps/scale.ts"
import { Chain, ClientRune, CodecRune, ExtrinsicRune, state } from "../../fluent/mod.ts"
import { Client } from "../../rpc/client.ts"
import { ArrayRune, Rune, RunicArgs, ValueRune } from "../../rune/mod.ts"
import { DeriveCodec } from "../../scale_info/mod.ts"
import { hex } from "../../util/mod.ts"
import { Callable, InkMetadata, normalize } from "./InkMetadata.ts"
import { InkRune } from "./InkRune.ts"
import { $contractsApiInstantiateArgs, $contractsApiInstantiateResult, Weight } from "./known.ts"

// TODO: `onInstantiated`
export interface InstantiateProps {
  code: Uint8Array
  sender: Uint8Array
  value?: bigint
  ctor?: string
  args?: unknown[]
  gasLimit?: Weight
  storageDepositLimit?: bigint
  salt?: Uint8Array
}

export class InkMetadataRune<out U, out C extends Chain = Chain> extends Rune<InkMetadata, U> {
  deriveCodec

  constructor(_prime: InkMetadataRune<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
    this.deriveCodec = this
      .into(ValueRune)
      .access("V3", "types")
      .map(DeriveCodec)
  }

  static from<X>(...[client, jsonText]: RunicArgs<X, [client: Client, jsonText: string]>) {
    return Rune
      .resolve(jsonText)
      .map((jsonText) => normalize(JSON.parse(jsonText)))
      .into(InkMetadataRune, Rune.resolve(client).into(ClientRune))
  }

  salt() {
    return Rune.constant(crypto.getRandomValues(new Uint8Array(4)))
  }

  encodeData<X>(...args_: RunicArgs<X, [metadata: Callable, args?: unknown[]]>) {
    const [metadata, args] = RunicArgs.resolve(args_)
    const selector = metadata.access("selector").map(hex.decode)
    const selectorLength = selector.access("length")
    const argCodecs = metadata
      .access("args")
      .into(ArrayRune)
      .mapArray((arg) =>
        Rune
          .tuple([this.deriveCodec, arg.access("type").access("type")])
          .map(([deriveCodec, i]) => deriveCodec(i))
      )
    return Rune
      .tuple([selectorLength, argCodecs])
      .map(([selectorLength, argCodecs]) =>
        $.tuple($.sizedUint8Array(selectorLength), ...argCodecs)
      )
      .into(CodecRune)
      .encoded(
        Rune
          .tuple([selector, args])
          .map(([selector, args]) => [selector, ...args ?? []]),
      )
  }

  instantiate<X>(props: RunicArgs<X, InstantiateProps>) {
    const { code } = props
    const salt = Rune
      .resolve(props.salt)
      .unhandle(undefined)
      .rehandle(undefined, this.salt)
    const storageDepositLimit = Rune.resolve(props.storageDepositLimit)
    const value = Rune
      .resolve(props.value)
      .unhandle(undefined)
      .rehandle(undefined, () => Rune.constant(0n))
    const ctorMetadata = Rune.tuple([
      this
        .into(ValueRune)
        .access("V3", "spec", "constructors"),
      Rune
        .resolve(props.ctor)
        .unhandle(undefined)
        .rehandle(undefined, () => Rune.resolve("default")),
    ])
      .map(([ctors, label]) => ctors.find((ctor) => ctor.label === label))
      .unhandle(undefined)
      .rehandle(undefined, () => Rune.constant(new CtorNotFoundError()))
      .unhandle(CtorNotFoundError)
    const data = this.encodeData(ctorMetadata, props.args)
    const instantiateArgs = Rune
      .constant($contractsApiInstantiateArgs)
      .into(CodecRune)
      .encoded(Rune.tuple([
        props.sender,
        value,
        undefined,
        storageDepositLimit,
        Rune.rec({ type: "Upload" as const, value: code }),
        data,
        salt,
      ]))
    const gasLimit = Rune
      .resolve(props.gasLimit)
      .unhandle(undefined)
      .rehandle(undefined, () =>
        state
          .call(this.client, "ContractsApi_instantiate", instantiateArgs.map(hex.encode))
          .map((result) => $contractsApiInstantiateResult.decode(hex.decode(result)))
          .access("gasRequired"))
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
      .into(ExtrinsicRune, this.client)
  }

  instance<X>(...[client, publicKey]: RunicArgs<X, [client: Client, publicKey: Uint8Array]>) {
    return Rune
      .resolve(publicKey)
      .into(InkRune, Rune.resolve(client).into(ClientRune), this.as(InkMetadataRune))
  }
}

export class CtorNotFoundError extends Error {
  override readonly name = "CtorNotFoundError"
}
