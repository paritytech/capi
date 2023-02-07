import * as $ from "../../deps/scale.ts"
import { Chain, ClientRune, CodecRune, state } from "../../fluent/mod.ts"
import { ArrayRune, Rune, RunicArgs, ValueRune } from "../../rune/mod.ts"
import { hex } from "../../util/mod.ts"
import { InkMetadataRune } from "./InkMetadataRune.ts"
import { $contractsApiCallArgs, $contractsApiCallResult, Weight } from "./known.ts"

export interface MsgProps {
  sender: Uint8Array
  method: string
  args?: unknown[]
  value?: bigint
  gasLimit?: Weight
}

export class InkRune<out U, out C extends Chain = Chain> extends Rune<Uint8Array, U> {
  constructor(
    _prime: InkRune<U>["_prime"],
    readonly client: ClientRune<U, C>,
    readonly contract: InkMetadataRune<U, C>,
  ) {
    super(_prime)
  }

  msg<X>(props: RunicArgs<X, MsgProps>) {
    const value = Rune
      .resolve(props.value)
      .unhandle(undefined)
      .rehandle(undefined, () => Rune.constant(0n))
    const msgMetadata = Rune.tuple([
      this.contract
        .into(ValueRune)
        .access("V3", "spec", "messages"),
      props.method,
    ])
      .map(([msgs, methodName]) => msgs.find((msgs) => msgs.label === methodName))
      .unhandle(undefined)
      .rehandle(undefined, () => Rune.constant(new MethodNotFoundError()))
      .unhandle(MethodNotFoundError)
    const selector = msgMetadata
      .access("selector")
      .map(hex.decode)
    const selectorLength = selector.access("length")
    const argCodecs = msgMetadata
      .access("args")
      .into(ArrayRune)
      .mapArray((arg) =>
        Rune
          .tuple([this.contract.deriveCodec, arg.access("type").access("type")])
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
      .constant($contractsApiCallArgs)
      .into(CodecRune)
      .encoded(Rune.tuple([props.sender, this, value, undefined, undefined, data]))
    return state
      .call(this.client, "ContractsApi_call", instantiateArgs.map(hex.encode))
      .map((result) => $contractsApiCallResult.decode(hex.decode(result)))
  }
}

export class MethodNotFoundError extends Error {
  override readonly name = "MethodNotFoundError"
}
