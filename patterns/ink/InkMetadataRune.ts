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
  Ss58Rune,
  ValueRune,
} from "../../mod.ts"
import { transformTys } from "../../scale_info/mod.ts"
import { $contractsApiInstantiateArgs, $contractsApiInstantiateResult, Weight } from "./codecs.ts"
import { Callable, InkMetadata, parse } from "./InkMetadata.ts"
import { InkRune } from "./InkRune.ts"

// TODO: `onInstantiated`
export interface InstantiateProps {
  code?: Uint8Array
  sender: Uint8Array
  value?: bigint
  ctor?: string
  args?: unknown[]
  gasLimit?: Weight
  storageDepositLimit?: bigint
  salt?: Uint8Array
}

export class InkMetadataRune<out U> extends Rune<InkMetadata, U> {
  static fromMetadataText<X>(...[text]: RunicArgs<X, [text: string]>) {
    return Rune.resolve(text).map(parse).into(InkMetadataRune)
  }

  codecs = this
    .into(ValueRune)
    .access("types")
    .map(transformTys)
    .access("ids")

  $event = Rune
    .tuple([
      this.into(ValueRune).access("spec", "events"),
      this.codecs,
    ])
    .map(([events, codecs]) =>
      $.taggedUnion(
        "type",
        events.map((event) =>
          $.variant(
            event.label,
            $.object(...event.args.map((arg) => $.field(arg.label, codecs[arg.type.type]!))),
          )
        ),
      )
    )
    .into(CodecRune)

  salt() {
    return Rune.constant(crypto.getRandomValues(new Uint8Array(4)))
  }

  // TODO: protected?
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

  instantiation<C extends Chain, U, X>(
    chain: ChainRune<C, U>,
    props: RunicArgs<X, InstantiateProps>,
  ) {
    const code = Rune
      .resolve(props.code)
      .unhandle(undefined)
      .rehandle(undefined, () =>
        this.into(ValueRune)
          .access("source", "wasm")
          .unhandle(undefined)
          .map(hex.decode)
          .rehandle(undefined))
    const codeHash = this.into(ValueRune).access("source", "hash").map(hex.decode)
    // TODO: verify deployed or throw
    // const sourceHash = this.into(ValueRune).access("source", "hash").map(hex.decode)
    // const codeHash = Rune.tuple([code, sourceHash])
    //   .map(([code, sourceHash]) =>
    //     code
    //       ? sourceHash
    //       : chain.pallet("Contracts").storage("CodeStorage").valueRaw(
    //         sourceHash as $.Native<Chain.Storage<C, "Contracts", "CodeStorage">["key"]>,
    //       )
    //         .unhandle(undefined)
    //         .map(() => sourceHash)
    //         .rehandle(undefined, () => Rune.constant(new NotDeployedError()))
    //         .unhandle(NotDeployedError)
    //   )
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
        .access("spec", "constructors"),
      Rune
        .resolve(props.ctor)
        .unhandle(undefined)
        .rehandle(undefined, () => Rune.resolve("new")),
    ])
      .map(([ctors, label]) => ctors.find((ctor) => ctor.label === label))
      .unhandle(undefined)
      .rehandle(undefined, () => Rune.constant(new CtorNotFoundError()))
      .unhandle(CtorNotFoundError)
    const data = this.encodeData(ctorMetadata, props.args)
    const codeUploadOrExisting = code
      .unhandle(undefined)
      .map((code) => ({ type: "Upload" as const, value: code }))
      .rehandle(undefined, () => Rune.object({ type: "Existing" as const, value: codeHash }))
      .into(ValueRune)
    const instantiateArgs = Rune
      .constant($contractsApiInstantiateArgs)
      .into(CodecRune)
      .encoded(Rune.tuple([
        props.sender,
        value,
        undefined,
        storageDepositLimit,
        codeUploadOrExisting,
        data,
        salt,
      ]))
    const gasLimit = Rune
      .resolve(props.gasLimit)
      .unhandle(undefined)
      .rehandle(
        undefined,
        () => {
          const args = instantiateArgs.map(hex.encode)
          return chain.connection
            .call("state_call", "ContractsApi_instantiate", args)
            .map((result) => $contractsApiInstantiateResult.decode(hex.decode(result)))
            .access("gasRequired")
        },
      )
    return Rune
      .object({
        type: "Contracts",
        value: Rune.object({
          type: code.map((code) => code ? "instantiateWithCode" : "instantiate"),
          value,
          gasLimit,
          storageDepositLimit,
          code,
          codeHash,
          data,
          salt,
        }),
      })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, chain)
  }

  instanceFromAccountId<C extends Chain, CU, X>(
    chain: ChainRune<C, CU>,
    ...[accountId]: RunicArgs<X, [accountId: Uint8Array]>
  ) {
    return Rune.resolve(accountId).into(InkRune, chain, this.as(InkMetadataRune))
  }

  instanceFromSs58<C extends Chain, CU, X>(
    chain: ChainRune<C, CU>,
    ...[ss58]: RunicArgs<X, [ss58: string]>
  ) {
    return this.instanceFromAccountId(
      chain,
      Rune.resolve(ss58).into(Ss58Rune, chain).accountId(),
    )
  }
}

export class CtorNotFoundError extends Error {
  override readonly name = "CtorNotFoundError"
}

export class NotDeployedError extends Error {
  override readonly name = "NotDeployedError"
}
