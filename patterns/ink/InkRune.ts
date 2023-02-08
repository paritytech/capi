import { equals } from "../../deps/std/bytes/mod.ts"
import { Chain, ClientRune, CodecRune, ExtrinsicRune, state } from "../../fluent/mod.ts"
import { Event } from "../../primitives/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../../rune/mod.ts"
import { hex } from "../../util/mod.ts"
import { isInstantiatedEvent } from "./events.ts"
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

  innerCall<X>(...args_: RunicArgs<X, [sender: Uint8Array, value: bigint, data: Uint8Array]>) {
    const [sender, value, data] = RunicArgs.resolve(args_)
    const instantiateArgs = Rune
      .constant($contractsApiCallArgs)
      .into(CodecRune)
      .encoded(Rune.tuple([sender, this, value, undefined, undefined, data]))
    return state
      .call(this.client, "ContractsApi_call", instantiateArgs.map(hex.encode))
      .map((result) => $contractsApiCallResult.decode(hex.decode(result)))
  }

  common<X>(props: RunicArgs<X, MsgProps>) {
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
    const data = this.contract.encodeData(msgMetadata, props.args)
    const value = Rune
      .resolve(props.value)
      .unhandle(undefined)
      .rehandle(undefined, () => Rune.constant(0n))
    const innerResult = this.innerCall(props.sender, value, data)
    return { msgMetadata, data, value, innerResult }
  }

  call<X>(props: RunicArgs<X, MsgProps>) {
    const { msgMetadata, innerResult } = this.common(props)
    const $result = Rune
      .tuple([
        this.contract.deriveCodec,
        msgMetadata.access("returnType", "type"),
      ])
      .map(([deriveCodec, i]) => deriveCodec(i))
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
      .into(ExtrinsicRune, this.client)
  }

  filterContractEvents = <X>(...[events]: RunicArgs<X, [events: Event[]]>) => {
    // TODO: return all relevant events, not just instantiated
    return Rune
      .tuple([Rune.resolve(events), this])
      .map(([events, publicKey]) =>
        events.filter((e) => {
          return isInstantiatedEvent(e) && equals(e.event.value.contract, publicKey)
        })
      )
  }

  // TODO: improve
  decodeErrorEvent = <X>(...[failRuntimeEvent]: RunicArgs<X, [any]>) => {
    const metadata = this.client.metadata()
    const $error = metadata.codec(
      metadata
        .pallet("Contracts")
        .into(ValueRune)
        .access("error")
        .unhandle(undefined)
        .rehandle(undefined, () => Rune.constant(new FailedToDecodeErrorError()))
        .unhandle(FailedToDecodeErrorError),
    )
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
