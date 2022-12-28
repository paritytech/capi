import * as Z from "../deps/zones.ts"
import { entryRead, entryReadRaw, keyPageRead } from "../effects/mod.ts"
import { extrinsic } from "../mod.ts"
import { MultiAddress } from "../primitives/mod.ts"
import * as rpc from "../rpc/mod.ts"
import { multisigAddress, u8a } from "../util/mod.ts"

interface Timepoint {
  height: number
  index: number
}

interface RatifyProps {
  sender: MultiAddress
  call: unknown
  maybeTimepoint?: Timepoint
}

interface VoteProps {
  sender: MultiAddress
  callHash: Uint8Array
  maybeTimepoint?: Timepoint
}

interface CancelProps {
  sender: MultiAddress
  callHash: Uint8Array
  timepoint: Timepoint
}

export class Multisig<Client extends Z.Effect<rpc.Client>> {
  readonly address
  constructor(
    readonly client: Client,
    readonly signatories: Uint8Array[],
    readonly threshold: number,
  ) {
    this.address = multisigAddress(signatories, threshold)
  }

  ratify<Props extends Z.Rec$<RatifyProps>>({
    sender,
    call,
    maybeTimepoint,
  }: Props) {
    const maxWeight = extrinsic(this.client)({
      sender,
      call,
    })
      .feeEstimate
      .access("weight")
    return extrinsic(this.client)({
      sender,
      call: Z.rec({
        type: "Multisig",
        value: Z.rec({
          type: "asMulti",
          threshold: this.threshold,
          call,
          otherSignatories: Z.ls(sender).next(([sender]) =>
            this.signatories.filter((value) => !u8a.isEqual(value, sender.value!))
          ),
          storeCall: false,
          maxWeight,
          maybeTimepoint,
        }),
      }),
    })
  }

  vote<Props extends Z.Rec$<VoteProps>>({
    sender,
    callHash,
    maybeTimepoint,
  }: Props) {
    return extrinsic(this.client)({
      sender,
      call: Z.rec({
        type: "Multisig",
        value: Z.rec({
          type: "approveAsMulti",
          threshold: this.threshold,
          callHash,
          otherSignatories: Z.ls(sender).next(([sender]) =>
            this.signatories.filter((value) => !u8a.isEqual(value, sender.value!))
          ),
          storeCall: false,
          maxWeight: {
            refTime: 0n,
            proofSize: 0n,
          },
          maybeTimepoint,
        }),
      }),
    })
  }

  cancel<Props extends Z.Rec$<CancelProps>>({
    sender,
    callHash,
    timepoint,
  }: Props) {
    return extrinsic(this.client)({
      sender,
      call: Z.rec({
        type: "Multisig",
        value: Z.rec({
          type: "cancelAsMulti",
          threshold: this.threshold,
          callHash,
          otherSignatories: Z.ls(sender).next(([sender]) =>
            this.signatories.filter((value) => !u8a.isEqual(value, sender.value!))
          ),
          timepoint,
        }),
      }),
    })
  }

  proposals(count: number) {
    return keyPageRead(this.client)("Multisig", "Multisigs", count, [this.address])
  }

  proposal(callHash: Z.$<Uint8Array>) {
    return entryRead(this.client)("Multisig", "Multisigs", [this.address, callHash])
  }

  isProposed(callHash: Z.$<Uint8Array>) {
    return entryReadRaw(this.client)("Multisig", "Multisigs", [this.address, callHash]).next(
      (entry: any) => entry !== null,
    )
  }
}
