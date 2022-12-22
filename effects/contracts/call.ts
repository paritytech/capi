import * as $ from "../../deps/scale.ts"
import * as Z from "../../deps/zones.ts"
import {
  $contractsApiCallArgs,
  $contractsApiCallResult,
  ContractMetadata,
} from "../../frame_metadata/Contract.ts"
import { DeriveCodec, MultiAddress } from "../../frame_metadata/mod.ts"
import { Client } from "../../rpc/mod.ts"
import * as U from "../../util/mod.ts"
import { extrinsic } from "../extrinsic.ts"
import { state } from "../rpc_known_methods.ts"

export interface CallProps {
  sender: MultiAddress
  contractAddress: Uint8Array
  contractMetadata: ContractMetadata
  message: ContractMetadata.Message
  args: any[]
}

export function call<Client_ extends Z.Effect<Client>>(client: Client_) {
  return <Props extends Z.Rec$<CallProps>>(_props: Props) => {
    const {
      sender,
      contractAddress,
      contractMetadata,
      message,
      args,
    } = _props as Z.Rec$Access<Props>
    const $message_ = $message(contractMetadata, message)
    const data = Z.ls($message_, message, args).next(([{ $args }, { selector }, args]) =>
      $args.encode([U.hex.decode(selector), ...args])
    )
    return Z.ls(
      stateContractsApiCall(client)({
        sender,
        contractAddress,
        data,
      }),
      $message_,
    )
      .next(([{ result: { data } }, { $result }]) => $result.decode(data))
  }
}

export interface CallTxProps {
  sender: MultiAddress
  contractAddress: Uint8Array
  value?: bigint
  contractMetadata: ContractMetadata
  message: ContractMetadata.Message
  args: any[]
}

export function callTx<Client_ extends Z.Effect<Client>>(client: Client_) {
  return <Props extends Z.Rec$<CallTxProps>>(_props: Props) => {
    const {
      sender,
      contractAddress,
      value,
      contractMetadata,
      message,
      args,
    } = _props as Z.Rec$Access<Props>
    const $message_ = $message(contractMetadata, message)
    const data = Z.ls($message_, message, args).next(([{ $args }, { selector }, args]) =>
      $args.encode([U.hex.decode(selector), ...args])
    )
    const txValue = Z.ls(
      stateContractsApiCall(client)({
        sender,
        contractAddress,
        value,
        data,
      }),
      contractAddress,
      value,
      data,
    )
      .next(([{ gasRequired }, contractAddress, value, data]) => (
        {
          type: "call",
          dest: MultiAddress.Id(contractAddress),
          value: value ?? 0n,
          data,
          gasLimit: gasRequired,
          storageDepositLimit: undefined,
        }
      ))
    return extrinsic(client)({
      sender,
      call: Z.rec({ type: "Contracts", value: txValue }),
    })
  }
}

export interface ContractsApiCallProps {
  sender: MultiAddress
  contractAddress: Uint8Array
  value?: bigint
  data: Uint8Array
}

export function stateContractsApiCall<Client_ extends Z.Effect<Client>>(client: Client_) {
  return <Props extends Z.Rec$<ContractsApiCallProps>>(_props: Props) => {
    const key = Z.rec(_props as Z.Rec$Access<Props>).next(
      ({ sender, contractAddress, value, data }) =>
        U.hex.encode($contractsApiCallArgs.encode([
          sender.value!, // TODO: grab public key in cases where we're not accepting multi?
          contractAddress,
          value ?? 0n,
          undefined,
          undefined,
          data,
        ])),
    )
    return state
      .call(client)("ContractsApi_call", key)
      .next((result) => {
        return $contractsApiCallResult.decode(U.hex.decode(result))
      })
  }
}

interface MessageCodecs {
  $args: $.Codec<[Uint8Array, ...unknown[]]>
  $result: $.Codec<any>
}

function $message(
  metadata: Z.$<ContractMetadata>,
  message: Z.$<ContractMetadata.Message>,
): Z.$<MessageCodecs> {
  return Z.ls(metadata, message).next(([metadata, message]) => {
    const deriveCodec = DeriveCodec(metadata.V3.types)
    return {
      $args: $.tuple(
        // message selector
        $.sizedUint8Array(U.hex.decode(message.selector).length),
        // message args
        ...message.args.map((arg) => deriveCodec(arg.type.type)),
      ),
      $result: message.returnType !== null
        ? deriveCodec(message.returnType.type)
        : $.constant(null),
    }
  })
}
