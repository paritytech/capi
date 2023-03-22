import { Multisig, Polkadot } from "polkadot/mod.ts"
import { MultiAddress } from "polkadot/types/sp_runtime/multiaddress.js"
import * as bytes from "../../deps/std/bytes.ts"
import {
  Chain,
  ChainRune,
  ExtrinsicRune,
  PatternRune,
  Rune,
  RunicArgs,
  ValueRune,
} from "../../mod.ts"
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

// TODO: incorporate `C` into pick util types
export type MultisigChain<C extends Chain> =
  & Chain.PickStorage<Polkadot, "Multisig", "Multisigs">
  & Chain.PickCall<Polkadot, "Multisig", "asMulti" | "approveAsMulti" | "cancelAsMulti">

export class MultisigRune<out C extends Chain, out U>
  extends PatternRune<Multisig, MultisigChain<C>, U>
{
  private value = this.into(ValueRune)
  threshold = this.value.map(({ threshold, signatories }) => threshold ?? signatories.length - 1)
  accountId = Rune.fn(multisigAccountId).call(this.value.access("signatories"), this.threshold)
  address = MultiAddress.Id(this.accountId)
  storage = this.chain.pallet("Multisig").storage("Multisigs")

  static from<C extends Chain, U, X>(
    chain: ChainRune<MultisigChain<C>, U>,
    props: RunicArgs<X, Multisig>,
  ) {
    return Rune.rec(props).into(this, chain)
  }

  otherSignatories<X>(...[sender]: RunicArgs<X, [sender: MultiAddress]>) {
    return Rune
      .tuple([this.into(ValueRune).access("signatories"), sender])
      .map(([signatories, sender]) =>
        signatories.filter((value) => !bytes.equals(value, sender.value!))
      )
  }

  ratify<X>({ sender, call: call_ }: RunicArgs<X, MultisigRatifyProps<C>>) {
    const call = Rune.resolve(call_).into(ExtrinsicRune, this.chain)
    return this.chain.extrinsic(Multisig.asMulti({
      threshold: this.threshold,
      call,
      otherSignatories: this.otherSignatories(sender),
      maxWeight: call.feeEstimate().access("weight"),
      maybeTimepoint: this.maybeTimepoint(call.hash),
    }))
  }

  approve<X>({ sender, callHash }: RunicArgs<X, MultisigVoteProps>) {
    return this.chain.extrinsic(Multisig.approveAsMulti({
      threshold: this.threshold,
      callHash: Rune.resolve(callHash),
      otherSignatories: this.otherSignatories(sender),
      maxWeight: {
        refTime: 0n,
        proofSize: 0n,
      },
      maybeTimepoint: this.maybeTimepoint(callHash),
    }))
  }

  cancel<X>({ sender, callHash }: RunicArgs<X, MultisigVoteProps>) {
    return this.chain.extrinsic(Multisig.cancelAsMulti({
      threshold: this.threshold,
      callHash,
      otherSignatories: this.otherSignatories(sender),
      timepoint: this.maybeTimepoint(callHash).map((x) => x ?? new NoProposalError()),
    }))
  }

  proposals<X>(...[count]: RunicArgs<X, [count: number]>) {
    return this.storage.keyPage(count, Rune.tuple([this.accountId])) // TODO: apply chain
  }

  proposal<X>(...[callHash]: RunicArgs<X, [callHash: Uint8Array]>) {
    return this.storage.value(Rune.tuple([this.accountId, callHash])) // TODO: apply chain
  }

  isProposed<X>(...[callHash]: RunicArgs<X, [callHash: Uint8Array]>) {
    return this.storage
      .valueRaw(Rune.tuple([this.accountId, callHash]))
      .map((entry) => entry !== null)
  }

  private maybeTimepoint<X>(...[callHash]: RunicArgs<X, [callHash: Uint8Array]>) {
    return this.proposal(callHash).unhandle(undefined).access("when")
  }
}

export class NoProposalError extends Error {
  override readonly name = "NoProposalError"
}
