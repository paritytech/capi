import {
  $,
  ArrayRune,
  Chain,
  ChainRune,
  CodecRune,
  ExtrinsicRune,
  hex,
  Rune,
  RunicArgs,
  ValueRune,
} from "../../mod.ts"
import { transformTys } from "../../scale_info/mod.ts"
import { $contractsApiInstantiateArgs, $contractsApiInstantiateResult, Weight } from "./codecs.ts"
import { Callable, InkMetadata } from "./InkMetadata.ts"
import { InkRune } from "./InkRune.ts"

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

export class InkMetadataRune<out C extends Chain, out U> extends Rune<InkMetadata, U> {
  codecs

  constructor(_prime: InkMetadataRune<C, U>["_prime"], readonly chain: ChainRune<C, U>) {
    super(_prime)
    this.codecs = this
      .into(ValueRune)
      .access("V3", "types")
      .map(transformTys)
      .access(0)
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
      .mapArray((arg) => {
        return this.codecs.access(arg.access("type", "type"))
      })
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
      .rehandle(
        undefined,
        () =>
          this.chain.connection.call(
            "state_call",
            "ContractsApi_instantiate",
            instantiateArgs.map(hex.encode),
          )
            .map((result) => $contractsApiInstantiateResult.decode(hex.decode(result)))
            .access("gasRequired"),
      )
    return Rune
      .rec({
        type: "Contracts",
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
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  instance<CU, X>(
    chain: ChainRune<C, CU>,
    ...[publicKey]: RunicArgs<X, [Uint8Array]>
  ) {
    return Rune
      .resolve(publicKey)
      .into(InkRune, chain, this.as(InkMetadataRune))
  }
}

export class CtorNotFoundError extends Error {
  override readonly name = "CtorNotFoundError"
}
