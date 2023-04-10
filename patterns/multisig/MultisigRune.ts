import { MultiAddress } from "@capi/polkadot/types/mod.js"
import * as bytes from "../../deps/std/bytes.ts"
import { $, Chain, ChainRune, PatternRune, Rune, RunicArgs, ValueRune } from "../../mod.ts"
import { multisigAccountId } from "./multisigAccountId.ts"

export interface MultisigRatifyProps<C extends Chain> {
  sender: MultiAddress
  call: Chain.Call<C>
}

export interface MultisigVoteProps {
  sender: MultiAddress
  callHash: Uint8Array
}

export interface Multisig {
  signatories: Uint8Array[]
  threshold?: number
}

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

  otherSignatories<X>(...[sender]: RunicArgs<X, [sender: MultiAddress]>) {
    return Rune
      .tuple([this.into(ValueRune).access("signatories"), sender])
      .map(([signatories, sender]) =>
        signatories.filter((value) => !bytes.equals(value, sender.value!))
      )
  }

  ratify<X>({ sender, call: call_ }: RunicArgs<X, MultisigRatifyProps<C>>) {
    const call = this.chain.extrinsic(Rune.resolve(call_).unsafeAs<Chain.Call<C>>())
    return this.chain.extrinsic(
      Rune
        .rec({
          type: "Multisig",
          value: Rune.rec({
            type: "asMulti",
            threshold: this.threshold,
            call,
            otherSignatories: this.otherSignatories(sender),
            storeCall: false,
            maxWeight: call.feeEstimate().access("weight"),
            maybeTimepoint: this.maybeTimepoint(call.hash),
          }),
        })
        .unsafeAs<Chain.Call<C>>(),
    )
  }

  approve<X>({ sender, callHash }: RunicArgs<X, MultisigVoteProps>) {
    return this.chain.extrinsic(
      Rune
        .rec({
          type: "Multisig",
          value: Rune.rec({
            type: "approveAsMulti",
            threshold: this.threshold,
            callHash,
            otherSignatories: this.otherSignatories(sender),
            storeCall: false,
            maxWeight: { refTime: 0n, proofSize: 0n },
            maybeTimepoint: this.maybeTimepoint(callHash),
          }),
        })
        .unsafeAs<Chain.Call<C>>(),
    )
  }

  cancel<X>({ sender, callHash }: RunicArgs<X, MultisigVoteProps>) {
    return this.chain.extrinsic(
      Rune
        .rec({
          type: "Multisig",
          value: Rune.rec({
            type: "cancelAsMulti",
            threshold: this.threshold,
            callHash,
            otherSignatories: this.otherSignatories(sender),
            timepoint: this.maybeTimepoint(callHash).map((x) => x ?? new NoProposalError()),
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
      .unhandle(undefined)
      .access("when")
      .rehandle(undefined)
  }

  proposals<X>(...[count, blockHash]: RunicArgs<X, [count: number, blockHash?: string]>) {
    return this.storage.keyPage(
      count,
      Rune
        .tuple([this.accountId])
        .unsafeAs<$.Native<Chain.Storage<C, "Multisig", "Multisigs">["partialKey"]>>(),
      undefined,
      blockHash,
    )
  }

  proposal<X>(...[callHash, blockHash]: RunicArgs<X, [callHash: Uint8Array, blockHash?: string]>) {
    return this.storage
      .value(
        Rune
          .tuple([this.accountId, callHash])
          .unsafeAs<$.Native<Chain.Storage<C, "Multisig", "Multisigs">["key"]>>(),
        blockHash,
      )
      .unsafeAs<
        undefined | {
          when: { height: number; index: number }
          approvals: Uint8Array[]
          depositor: bigint
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
          .unsafeAs<$.Native<Chain.Storage<C, "Multisig", "Multisigs">["key"]>>(),
        blockHash,
      )
      .map((entry) => entry !== null)
  }
}

export class NoProposalError extends Error {
  override readonly name = "NoProposalError"
}
