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

// TODO: swap out `Chain` constraints upon subset gen issue resolution... same for other patterns
export class MultisigRune<out C extends Chain, out U> extends PatternRune<Multisig, C, U> {
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
      (multisig, chain, callHash) =>
        multisig.into(MultisigRune, chain.into(ChainRune))
          .proposal(callHash)
          .unsafeAs<{ when: unknown }>()
          .into(ValueRune)
          .access("when"),
    )
  }

  proposals<X>(...[count]: RunicArgs<X, [count: number]>) {
    // @ts-ignore .
    return this.storage.keyPage(count, Rune.tuple([this.accountId]))
  }

  proposal<X>(...[callHash]: RunicArgs<X, [callHash: Uint8Array]>) {
    // @ts-ignore .
    return this.storage.value(Rune.tuple([this.accountId, callHash]))
  }

  isProposed<X>(...[callHash]: RunicArgs<X, [callHash: Uint8Array]>) {
    // @ts-ignore .
    return this.storage.valueRaw(Rune.tuple([this.accountId, callHash]))
      .map((entry) => entry !== null)
  }
}

export class NoProposalError extends Error {
  override readonly name = "NoProposalError"
}
