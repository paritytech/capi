import { PalletContractsEvent, RuntimeEvent } from "@capi/contracts-dev"
import {
  ArrayRune,
  Chain,
  CodecRune,
  Event,
  ExtrinsicRune,
  hex,
  is,
  PatternRune,
  Rune,
  RunicArgs,
  ValueRune,
} from "../../../mod.ts"
import { $contractsApiCallArgs, $contractsApiCallResult, Weight } from "./codecs.ts"
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
        this.parent.into(ValueRune).access("spec", "messages"),
        props.method,
      ])
      .map(([msgs, methodName]) => msgs.find((msgs) => msgs.label === methodName))
      .unhandle(is(undefined))
      .rehandle(is(undefined), () => Rune.constant(new MethodNotFoundError()))
      .unhandle(is(MethodNotFoundError))
    const data = this.parent.encodeData(msgMetadata, props.args)
    const value = Rune
      .resolve(props.value)
      .handle(is(undefined), () => Rune.constant(0n))
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
      .object({
        type: "Contracts",
        value: Rune.object({
          type: "call",
          dest: Rune.object({
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

  emittedEvents = <X>(...[events]: RunicArgs<X, [events: Event[]]>) => {
    return Rune
      .resolve(events)
      .map((events) =>
        // TODO: clean this up
        events.filter(({ event }) => {
          const event_ = event as RuntimeEvent
          return RuntimeEvent.isContracts(event_)
            && PalletContractsEvent.isContractEmitted(event_.value)
        }) as Event<RuntimeEvent.Contracts & { value: PalletContractsEvent.ContractEmitted }>[]
      )
      .into(ArrayRune)
      .mapArray((event) => this.parent.$event.decoded(event.access("event", "value", "data")))
  }
}

export class MethodNotFoundError extends Error {
  override readonly name = "MethodNotFoundError"
}
