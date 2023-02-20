import * as bytes from "../deps/std/bytes.ts"
import { Chain, ClientRune } from "../fluent/ClientRune.ts"
import { MultiAddress } from "../primitives/mod.ts"
import { Client } from "../rpc/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { multisigAccountId } from "./multisigAccountId.ts"

export interface MultisigRatifyProps {
  sender: MultiAddress
  call: unknown
}

export interface MultisigVoteProps {
  sender: MultiAddress
  callHash: Uint8Array
}

export interface Multisig {
  signatories: Uint8Array[]
  threshold: number
}

export class MultisigRune<out U, out C extends Chain = Chain> extends Rune<Multisig, U> {
  threshold = this.into(ValueRune).access("threshold")
  address = this.into(ValueRune).map(({ signatories, threshold }) =>
    multisigAccountId(signatories, threshold)
  )

  private pallet
  private storage

  constructor(_prime: MultisigRune<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
    this.pallet = this.client.metadata().pallet("Multisig")
    this.storage = this.pallet.storage("Multisigs")
  }

  static from<X>(...[client, multisig]: RunicArgs<X, [client: Client, multisig: Multisig]>) {
    return Rune
      .resolve(multisig)
      .into(MultisigRune, Rune.resolve(client).into(ClientRune))
  }

  otherSignatories<X>(...[sender]: RunicArgs<X, [sender: MultiAddress]>) {
    return Rune
      .tuple([this.into(ValueRune).access("signatories"), sender])
      .map(([signatories, sender]) =>
        signatories.filter((value) => !bytes.equals(value, sender.value!))
      )
  }

  ratify<X>({ sender, call: _call }: RunicArgs<X, MultisigRatifyProps>) {
    const call = this.client.extrinsic(_call)
    const maxWeight = call.feeEstimate().access("weight")
    return this.client.extrinsic(Rune.rec({
      type: "Multisig",
      value: Rune.rec({
        type: "asMulti",
        threshold: this.threshold,
        call,
        otherSignatories: this.otherSignatories(sender),
        storeCall: false,
        maxWeight,
        maybeTimepoint: this.maybeTimepoint(call.hash),
      }),
    }))
  }

  approve<X>({ sender, callHash }: RunicArgs<X, MultisigVoteProps>) {
    return this.client.extrinsic(Rune.rec({
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
    }))
  }

  cancel<X>({ sender, callHash }: RunicArgs<X, MultisigVoteProps>) {
    return this.client.extrinsic(Rune.rec({
      type: "Multisig",
      value: Rune.rec({
        type: "cancelAsMulti",
        threshold: this.threshold,
        callHash,
        otherSignatories: this.otherSignatories(sender),
        timepoint: this.maybeTimepoint(callHash).map((x) => x ?? new NoProposalError()),
      }),
    }))
  }

  private maybeTimepoint<X>(...[callHash]: RunicArgs<X, [callHash: Uint8Array]>) {
    return Rune.captureUnhandled(
      [this, this.client, callHash],
      (multisig, client, callHash) =>
        multisig.into(MultisigRune, client.into(ClientRune))
          .proposal(callHash)
          .unsafeAs<{ when: unknown }>()
          .into(ValueRune)
          .access("when")
          .rehandle(null, () => Rune.resolve(undefined)),
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
