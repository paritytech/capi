import * as Z from "../../deps/zones.ts"
import {
  $contractsApiInstantiateArgs,
  $contractsApiInstantiateResult,
  ContractMetadata,
} from "../../frame_metadata/Contract.ts"
import { MultiAddress } from "../../frame_metadata/mod.ts"
import { Client } from "../../rpc/mod.ts"
import * as U from "../../util/mod.ts"
import { extrinsic } from "../extrinsic.ts"
import { state } from "../rpc_known_methods.ts"

export interface InstantiateProps {
  sender: MultiAddress
  code: Uint8Array
  constructorMetadata: ContractMetadata.Constructor
  salt: Uint8Array
}

export function instantiate<Client_ extends Z.Effect<Client>>(client: Client_) {
  return <Props extends Z.Rec$<InstantiateProps>>(_props: Props) => {
    const { code, constructorMetadata, sender } = _props as Z.Rec$Access<Props>
    const value = Z.ls(_props.salt, instantiateGasEstimate(client)(_props), constructorMetadata)
      .next(([salt, { gasRequired }, { selector }]) => {
        // the contract address derived from the code hash and the salt
        return {
          type: "instantiateWithCode",
          value: 0n,
          gasLimit: gasRequired,
          storageDepositLimit: undefined,
          code,
          data: U.hex.decode(selector),
          salt,
        }
      })
    return extrinsic(client)({
      sender,
      call: Z.rec({ type: "Contracts", value }),
    })
  }
}

export function instantiateGasEstimate<Client_ extends Z.Effect<Client>>(client: Client_) {
  return <Props extends Z.Rec$<InstantiateProps>>(_props: Props) => {
    const key = Z.rec(_props as Z.Rec$Access<Props>).next(
      ({ code, constructorMetadata, sender, salt }) => {
        return U.hex.encode($contractsApiInstantiateArgs.encode([
          sender.value!, // TODO: grab public key in cases where we're not accepting multi?
          0n,
          undefined,
          undefined,
          { type: "Upload", value: code },
          U.hex.decode(constructorMetadata.selector),
          salt,
        ]))
      },
    )
    return state
      .call(client)("ContractsApi_instantiate", key)
      .next((result) => $contractsApiInstantiateResult.decode(U.hex.decode(result)))
  }
}
