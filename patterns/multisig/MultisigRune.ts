import { MultiAddress } from "@capi/polkadot"
import { equals } from "../../deps/std/bytes.ts"
import {
  $,
  Chain,
  ChainRune,
  CodecRune,
  hex,
  is,
  PatternRune,
  Rune,
  RunicArgs,
  ss58,
  ValueRune,
} from "../../mod.ts"
import { compareBytes } from "../../util/mod.ts"
import { multisigAccountId } from "./multisigAccountId.ts"

export interface Multisig {
  signatories: Uint8Array[]
  threshold?: number
}

export const $multisig: $.Codec<Multisig> = $.object(
  $.field("signatories", $.array($.sizedUint8Array(32))),
  $.optionalField("threshold", $.u8),
)

// TODO: swap out `Chain` constraints upon subset gen issue resolution... same for other patterns
export class MultisigRune<out C extends Chain, out U> extends PatternRune<Multisig, C, U> {
  static from<C extends Chain, U, X>(
    chain: ChainRune<C, U>,
    ...[multisig]: RunicArgs<X, [multisig: Multisig]>
  ) {
    return Rune.resolve(multisig).into(MultisigRune, chain)
  }

  private storage = this.chain.pallet("Multisig").storage("Multisigs")
  private value = this.into(ValueRune)
  threshold = this.value.map(({ threshold, signatories }) => threshold ?? signatories.length - 1)
  accountId = Rune.fn(multisigAccountId).call(this.value.access("signatories"), this.threshold)
  address = MultiAddress.Id(this.accountId)
  ss58 = Rune
    .tuple([this.chain.addressPrefix(), this.accountId])
    .map(([prefix, accountId]: any) => ss58.encode(prefix, accountId))
  encoded = CodecRune.from($multisig).encoded(this.as(MultisigRune))
  hex = this.encoded.map(hex.encode)

  otherSignatories<X>(...[sender]: RunicArgs<X, [sender: MultiAddress]>) {
    return Rune
      .tuple([this.into(ValueRune).access("signatories"), sender])
      .map(([signatories, sender]) =>
        signatories
          .filter((value) => !equals(value, sender.value!))
          .sort(compareBytes)
      )
  }

  ratify<X>(
    ...[sender, call_, nonExecuting]: RunicArgs<
      X,
      [sender: MultiAddress, call: Chain.Call<C>, nonExecuting?: boolean]
    >
  ) {
    const call = this.chain.extrinsic(Rune.resolve(call_).unsafeAs<Chain.Call<C>>())
    const otherSignatories = this.otherSignatories(sender)
    const maybeTimepoint = this.maybeTimepoint(call.callHash)
    const threshold = this.threshold
    return this.chain.extrinsic(
      Rune
        .object({
          type: "Multisig",
          value: nonExecuting
            ? Rune.object({
              type: "approveAsMulti",
              threshold,
              callHash: call.callHash,
              otherSignatories,
              maxWeight: { refTime: 0n, proofSize: 0n },
              maybeTimepoint,
            })
            : Rune.object({
              type: "asMulti",
              threshold,
              call,
              otherSignatories,
              maxWeight: call.weight(),
              maybeTimepoint,
            }),
        })
        .unsafeAs<Chain.Call<C>>(),
    )
  }

  cancel<X>(...[sender, callHash]: RunicArgs<X, [sender: MultiAddress, callHash: Uint8Array]>) {
    return this.chain.extrinsic(
      Rune
        .object({
          type: "Multisig",
          value: Rune.object({
            type: "cancelAsMulti",
            threshold: this.threshold,
            callHash,
            otherSignatories: this.otherSignatories(sender),
            timepoint: this.maybeTimepoint(callHash).map((x: any) => x ?? new NoProposalError()),
          }),
        })
        .unsafeAs<Chain.Call<C>>(),
    )
  }

  fund<X>(...[amount]: RunicArgs<X, [amount: bigint]>) {
    return this.chain.extrinsic(
      Rune
        .object({
          type: "Balances",
          value: Rune.object({
            type: "transfer",
            dest: this.address,
            value: amount,
          }),
        })
        .unsafeAs<Chain.Call<C>>(),
    )
  }

  maybeTimepoint<X>(
    ...[callHash, blockHash]: RunicArgs<X, [callHash: Uint8Array, blockHash?: string]>
  ) {
    return this
      .proposal(callHash, blockHash)
      .unhandle(is(undefined))
      .access("when")
      .rehandle(is(undefined))
  }

  // TODO: why the type errors?
  proposals<X>(
    ...[limit, blockHash]: RunicArgs<X, [limit: number, blockHash?: string]>
  ): ValueRune<Chain.Storage.Key<C, "Multisig", "multisigs">[], RunicArgs.U<X> | U> {
    const partialKey = Rune.tuple([this.accountId])
    return this.storage.keys({
      limit,
      partialKey: partialKey as never,
    }, blockHash) as never
  }

  proposal<X>(...[callHash, blockHash]: RunicArgs<X, [callHash: Uint8Array, blockHash?: string]>) {
    return this.storage
      .value(
        Rune
          .tuple([this.accountId, callHash])
          .unsafeAs<$.Output<Chain.Storage<C, "Multisig", "Multisigs">["key"]>>(),
        blockHash,
      )
      .unsafeAs<
        undefined | {
          when: { height: number; index: number }
          approvals: Uint8Array[]
          depositor: Uint8Array
        }
      >()
      .into(ValueRune)
  }

  isProposed<X>(
    ...[callHash, blockHash]: RunicArgs<X, [callHash: Uint8Array, blockHash?: string]>
  ) {
    return this.storage
      .valueRaw(
        Rune
          .tuple([this.accountId, callHash])
          .unsafeAs<$.Output<Chain.Storage<C, "Multisig", "Multisigs">["key"]>>(),
        blockHash,
      )
      .map((entry) => entry !== null)
  }

  static fromHex<C extends Chain, U, X>(
    chain: ChainRune<C, U>,
    ...[state]: RunicArgs<X, [state: string]>
  ) {
    return CodecRune.from($multisig)
      .decoded(Rune.resolve(state).into(ValueRune).map(hex.decode))
      .into(MultisigRune, chain)
  }
}

export class NoProposalError extends Error {
  override readonly name = "NoProposalError"
}
