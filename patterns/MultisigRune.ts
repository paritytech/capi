import { types } from "polkadot_dev/mod.ts"
import * as bytes from "../deps/std/bytes.ts"
import { Chain, ChainRune } from "../fluent/ChainRune.ts"
import { ExtrinsicRune } from "../fluent/mod.ts"
import { MultiAddress } from "../primitives/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
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
  threshold: number
}

// TODO: swap out `Chain` constraints upon subset gen issue resolution... same for other patterns
export class MultisigRune<out U, out C extends Chain = Chain> extends Rune<Multisig, U> {
  threshold = this.into(ValueRune).access("threshold")
  address = this.into(ValueRune).map(({ signatories, threshold }) =>
    multisigAccountId(signatories, threshold)
  )

  private pallet
  private storage

  constructor(_prime: MultisigRune<U>["_prime"], readonly chain: ChainRune<U, C>) {
    super(_prime)
    this.pallet = this.chain.metadata().pallet("Multisig")
    this.storage = this.pallet.storage("Multisigs")
  }

  otherSignatories<X>(...[sender]: RunicArgs<X, [sender: MultiAddress]>) {
    return Rune
      .tuple([this.into(ValueRune).access("signatories"), sender])
      .map(([signatories, sender]) =>
        signatories.filter((value) => !bytes.equals(value, sender.value!))
      )
  }

  ratify<X>({ sender, call: call_ }: RunicArgs<X, MultisigRatifyProps<C>>) {
    const call = Rune
      .resolve(call_)
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
    return Rune
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
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  approve<X>({ sender, callHash }: RunicArgs<X, MultisigVoteProps>) {
    return Rune
      .rec({
        type: "Multisig",
        value: Rune.rec({
          type: "approveAsMulti",
          threshold: this.threshold,
          callHash,
          otherSignatories: this.otherSignatories(sender),
          storeCall: false,
          // TODO: is this right?
          maxWeight: {
            refTime: 0n,
            proofSize: 0n,
          },
          maybeTimepoint: this.maybeTimepoint(callHash),
        }),
      })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  cancel<X>({ sender, callHash }: RunicArgs<X, MultisigVoteProps>) {
    return Rune
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
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  private maybeTimepoint<X>(...[callHash]: RunicArgs<X, [callHash: Uint8Array]>) {
    return Rune.captureUnhandled(
      [this, this.chain, callHash],
      (multisig, client, callHash) =>
        multisig.into(MultisigRune, client.into(ChainRune))
          .proposal(callHash)
          .unsafeAs<{ when: unknown }>()
          .into(ValueRune)
          .access("when"),
    )
  }

  proposals<X>(...[count]: RunicArgs<X, [count: number]>) {
    return this.storage.keyPage(count, Rune.tuple([this.address]))
  }

  proposal<X>(...[callHash]: RunicArgs<X, [callHash: Uint8Array]>) {
    return this.storage.entry(Rune.tuple([this.address, callHash]))
  }

  isProposed<X>(...[callHash]: RunicArgs<X, [callHash: Uint8Array]>) {
    return this.storage.entryRaw(Rune.tuple([this.address, callHash]))
      .map((entry) => entry !== null)
  }
}

export class NoProposalError extends Error {
  override readonly name = "NoProposalError"
}
