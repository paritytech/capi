import { equals } from "../../deps/std/bytes.ts"
import {
  Chain,
  CodecRune,
  Event,
  ExtrinsicRune,
  hex,
  PatternRune,
  Rune,
  RunicArgs,
  ValueRune,
} from "../../mod.ts"
import { $contractsApiCallArgs, $contractsApiCallResult, Weight } from "./codecs.ts"
import { isContractsRuntimeEvent } from "./events.ts"
import { InkMetadataRune } from "./InkMetadataRune.ts"

export interface MsgProps {
  sender: Uint8Array
  method: string
  args?: unknown[]
  value?: bigint
  gasLimit?: Weight
}

export class InkRune<out C extends Chain, out U>
  extends PatternRune<Uint8Array, C, U, InkMetadataRune<U>>
{
  innerCall<X>(...args_: RunicArgs<X, [sender: Uint8Array, value: bigint, data: Uint8Array]>) {
    const [sender, value, data] = RunicArgs.resolve(args_)
    const instantiateArgs = Rune
      .constant($contractsApiCallArgs)
      .into(CodecRune)
      .encoded(Rune.tuple([sender, this, value, undefined, undefined, data]))
    return this.chain.connection
      .call("state_call", "ContractsApi_call", instantiateArgs.map(hex.encode))
      .map((result) => $contractsApiCallResult.decode(hex.decode(result)))
  }

  common<X>(this: InkRune<C, U>, props: RunicArgs<X, MsgProps>) {
    const msgMetadata = Rune
      .tuple([
        this.parent.into(ValueRune).access("V3", "spec", "messages"),
        props.method,
      ])
      .map(([msgs, methodName]) => msgs.find((msgs) => msgs.label === methodName))
      .unhandle(undefined)
      .rehandle(undefined, () => Rune.constant(new MethodNotFoundError()))
      .unhandle(MethodNotFoundError)
    const data = this.parent.encodeData(msgMetadata, props.args)
    const value = Rune
      .resolve(props.value)
      .unhandle(undefined)
      .rehandle(undefined, () => Rune.constant(0n))
    const innerResult = this.innerCall(props.sender, value, data)
    return { msgMetadata, data, value, innerResult }
  }

  call<X>(props: RunicArgs<X, MsgProps>) {
    const { msgMetadata, innerResult } = this.common(props)
    const $result = this.parent.codecs
      .access(msgMetadata.access("returnType", "type"))
      .into(CodecRune)
    return $result.decoded(innerResult.access("result", "data"))
  }

  tx<X>(props: RunicArgs<X, MsgProps>) {
    const { value, data, innerResult } = this.common(props)
    const gasLimit = innerResult.access("gasRequired") // TODO: make explicitly configurable?
    const storageDepositLimit = innerResult.access("storageDeposit", "value")
    return Rune
      .rec({
        type: "Contracts",
        value: Rune.rec({
          type: "call",
          dest: Rune.rec({
            type: "Id",
            value: this.as(InkRune),
          }),
          value,
          data,
          gasLimit,
          storageDepositLimit,
        }),
      })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  filterContractEvents = <X>(...[events]: RunicArgs<X, [events: Event[]]>) => {
    // TODO: return all relevant events, not just instantiated
    return Rune
      .tuple([Rune.resolve(events), this])
      .map(([events, publicKey]) =>
        events.filter((e) =>
          isContractsRuntimeEvent(e) && equals(e.event.value.contract, publicKey)
        )
      )
  }

  // TODO: improve
  decodeErrorEvent = <X>(...[failRuntimeEvent]: RunicArgs<X, [any]>) => {
    const $error = this.chain
      .pallet("Contracts")
      .into(ValueRune)
      .access("types", "error")
      .unhandle(undefined)
      .rehandle(undefined, () => Rune.constant(new FailedToDecodeErrorError()))
      .unhandle(FailedToDecodeErrorError)
    return Rune
      .tuple([Rune.resolve(failRuntimeEvent), $error])
      .map(([failEvent, $error]) => {
        const { dispatchError } = failEvent.event.value
        if (dispatchError.type !== "Module") return new FailedToDecodeErrorError()
        return $error.decode(dispatchError.value.error)
      })
      .unhandle(FailedToDecodeErrorError)
  }

  // // TODO: finish this
  // emissions<X>(...[events]: RunicArgs<X, [events: Event[]]>) {
  //   const $event: $.Codec<unknown> = null!
  //   return Rune
  //     .tuple([Rune.resolve(events), $event])
  //     .map(([events, $event]) =>
  //       events
  //         .filter(isContractEmittedEvent)
  //         .map((event) => $event.decode(event.event.value.data))
  //     )
  // }
}

export class MethodNotFoundError extends Error {
  override readonly name = "MethodNotFoundError"
}

export class FailedToDecodeErrorError extends Error {
  override readonly name = "FailedToDecodeErrorError"
}
