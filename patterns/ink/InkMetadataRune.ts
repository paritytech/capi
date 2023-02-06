import * as $ from "../../deps/scale.ts"
import {
  Chain,
  ClientRune,
  CodecRune,
  ExtrinsicFailedRuntimeEvent,
  ExtrinsicRune,
  state,
} from "../../fluent/mod.ts"
import { Client } from "../../rpc/client.ts"
import { ArrayRune, Rune, RunicArgs, ValueRune } from "../../rune/mod.ts"
import { DeriveCodec } from "../../scale_info/mod.ts"
import { hex } from "../../util/mod.ts"
import { InkMetadata, normalize } from "./InkMetadata.ts"
import { $contractsApiInstantiateArgs, $contractsApiInstantiateResult, Weight } from "./known.ts"

// TODO: `onInstantiated`
export interface InstantiateProps {
  code: Uint8Array
  origin: Uint8Array
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

  instantiate<X>(props: RunicArgs<X, InstantiateProps>) {
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
    const ctor = this.ctorMetadata(props.ctor)
    const selector = ctor.access("selector").map(hex.decode)
    const selectorLength = selector.access("length")
    const argCodecs = ctor
      .access("args")
      .into(ArrayRune)
      .mapArray((arg) =>
        Rune
          .tuple([this.deriveCodec, arg.access("type").access("type")])
          .map(([deriveCodec, i]) => deriveCodec(i))
      )
    const data = Rune
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
    const instantiateArgs = Rune
      .constant($contractsApiInstantiateArgs)
      .into(CodecRune)
      .encoded(Rune.tuple([
        props.origin,
        value,
        undefined,
        storageDepositLimit,
        Rune.rec({ type: "Upload" as const, value: code }),
        data,
        salt,
      ]))
    const gasLimit = props.gasLimit ?? state
      .call(this.client, "ContractsApi_instantiate", instantiateArgs.map(hex.encode))
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
      .dbg()
      .into(ExtrinsicRune, this.client)
  }

  ctorMetadata<X>(...[name]: RunicArgs<X, [name?: string]>) {
    return Rune.tuple([
      this
        .into(ValueRune)
        .access("V3", "spec", "constructors"),
      Rune
        .resolve(name)
        .unhandle(undefined)
        .handle(undefined, () => Rune.resolve("default")),
    ])
      .map(([ctors, label]) => ctors.find((ctor) => ctor.label === label))
      .unhandle(undefined)
      .handle(undefined, () => Rune.constant(new InvalidMetadataError()))
      .unhandle(InvalidMetadataError)
  }

  msgMetadata<X>(...[name]: RunicArgs<X, [name?: string]>) {
    return this
      .into(ValueRune)
      .access("V3", "spec", "messages")
      .map((msgs) => msgs.find((msgs) => msgs.label === name))
      .unhandle(undefined)
      .handle(undefined, () => Rune.constant(new InvalidMsgError()))
      .unhandle(InvalidMsgError)
  }

  decodeError<X>(...[failRuntimeEvent]: RunicArgs<X, [ExtrinsicFailedRuntimeEvent]>) {
    const metadata = this.client.metadata()
    const $error = metadata.codec(
      metadata
        .pallet("Contracts")
        .into(ValueRune).dbg("pallet:")
        .access("error").dbg("error:")
        .unhandle(undefined)
        .handle(undefined, () => Rune.constant(new FailedToDecodeErrorError()))
        .unhandle(FailedToDecodeErrorError),
    )
    return Rune
      .tuple([Rune.resolve(failRuntimeEvent), $error])
      .map(([failEvent, $error]) => {
        const { dispatchError } = failEvent.value
        if (dispatchError.type !== "Module") return new FailedToDecodeErrorError()
        return $error.decode(dispatchError.value.error)
      })
      .unhandle(FailedToDecodeErrorError)
  }
}

export class InvalidMetadataError extends Error {
  override readonly name = "InvalidMetadataError"
}

export class InvalidMsgError extends Error {
  override readonly name = "InvalidMsgError"
}

export class FailedToDecodeErrorError extends Error {
  override readonly name = "FailedToDecodeErrorError"
}
