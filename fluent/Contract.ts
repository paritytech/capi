import * as Z from "../deps/zones.ts"
import { contracts, events } from "../effects/mod.ts"
import { ContractMetadata, MultiAddress, Signer } from "../frame_metadata/mod.ts"
import * as rpc from "../rpc/mod.ts"

export interface ContractCallProps<Args extends unknown[] = any[]> {
  sender: MultiAddress
  messageLabel: string
  args: Args
}
export interface ContractCallTxProps<Args extends unknown[] = any[]>
  extends ContractCallProps<Args>
{
  value?: bigint
  sign: Signer
}

// TODO: codegen each contract message as a method
// TODO: model ctor inputs as effects
export class Contract<Client extends Z.Effect<rpc.Client>> {
  constructor(
    readonly client: Client,
    readonly contractMetadata: ContractMetadata,
    readonly contractAddress: Uint8Array,
  ) {}

  #basePayload<
    Sender extends Z.$<MultiAddress>,
    MessageLabel extends Z.$<string>,
    Args extends Z.$<unknown[]>,
  >(
    sender: Sender,
    messageLabel: MessageLabel,
    args: Args,
  ) {
    return {
      sender,
      contractAddress: this.contractAddress,
      contractMetadata: this.contractMetadata,
      message: this.#getMessageByLabel(messageLabel)!,
      args,
    }
  }

  call<Props extends Z.Rec$<ContractCallProps>>(props: Props) {
    return contracts.call(this.client)(
      this.#basePayload(props.sender, props.messageLabel, props.args),
    )
  }

  callTx<Props extends Z.Rec$<ContractCallTxProps>>(props: Props) {
    const tx = contracts.callTx(this.client)({
      ...this.#basePayload(props.sender, props.messageLabel, props.args),
      value: props.value,
    }).signed(props.sign)
    const finalizedIn = tx.watch(({ end }) =>
      (status) => {
        if (typeof status !== "string" && (status.inBlock ?? status.finalized)) {
          return end(status.inBlock ?? status.finalized)
        } else if (rpc.known.TransactionStatus.isTerminal(status)) {
          return end(new Error())
        }
        return
      }
    )
    const events_ = events(tx, finalizedIn)
    const contractEvents = contracts.events(this.contractMetadata, events_)
    return Z.ls(finalizedIn, events_, contractEvents)
  }

  #getMessageByLabel<Label extends Z.$<string>>(label: Label) {
    return Z.lift(label).next((label) =>
      this.contractMetadata.V3.spec.messages.find((c) => c.label === label)!
    )
  }
}
