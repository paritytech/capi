import * as path from "http://localhost:5646/@local/deps/std/path.ts"
import * as C from "http://localhost:5646/@local/mod.ts"
import * as T from "http://localhost:5646/@local/test_util/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"
import {
  $contractsApiCallArgs,
  $contractsApiCallResult,
  $contractsApiInstantiateArgs,
  $contractsApiInstantiateResult,
} from "../frame_metadata/Contract.ts"

const configFile = getFilePath("smart_contract/zombienet.toml")
const zombienet = await T.zombienet.start(configFile)
const client = zombienet.clients.byName["collator01"]!

const contract = await getContract(
  getFilePath("smart_contract/flipper.wasm"),
  getFilePath("smart_contract/metadata.json"),
)

const contractAddress = U.throwIfError(await instantiateContractTx().run())
console.log("Deployed Contract address", U.ss58.encode(42, contractAddress))

function instantiateContractTx() {
  const constructor = findContractConstructorByLabel("default")!
  const salt = Uint8Array.from(Array.from([0, 0, 0, 0]), () => Math.floor(Math.random() * 16))
  const value = preSubmitContractInstantiateDryRunGasEstimate(constructor, contract.wasm, salt)
    .next(({ gasRequired, result: { accountId } }) => {
      // the contract address derived from the code hash and the salt
      console.log("Derived contract address", U.ss58.encode(42, accountId))
      return {
        type: "instantiateWithCode",
        value: 0n,
        gasLimit: {
          refTime: gasRequired.refTime,
          proofSize: gasRequired.proofSize,
        },
        storageDepositLimit: undefined,
        code: contract.wasm,
        data: U.hex.decode(constructor.selector),
        salt,
      }
    })
  const tx = C.extrinsic(client)({
    sender: T.alice.address,
    call: C.Z.rec({
      type: "Contracts",
      value,
    }),
  })
    .signed(T.alice.sign)
  const finalizedIn = tx.watch(({ end }) =>
    (status) => {
      if (typeof status !== "string" && (status.inBlock ?? status.finalized)) {
        return end(status.inBlock ?? status.finalized)
      } else if (C.rpc.known.TransactionStatus.isTerminal(status)) {
        return end(new Error())
      }
      return
    }
  )
  return C.events(tx, finalizedIn).next((events) => {
    const extrinsicFailed = events.some((e) =>
      e.event?.type === "System" && e.event?.value?.type === "ExtrinsicFailed"
    )
    if (extrinsicFailed) {
      return new Error("extrinsic failed")
    }
    const event = events.find((e) =>
      e.event?.type === "Contracts" && e.event?.value?.type === "Instantiated"
    )
    return event?.event?.value.contract as Uint8Array
  })
}

function preSubmitContractInstantiateDryRunGasEstimate(
  message: C.M.ContractMetadata.Constructor,
  code: Uint8Array,
  salt: Uint8Array,
) {
  const key = U.hex.encode($contractsApiInstantiateArgs.encode([
    T.alice.publicKey,
    0n,
    undefined,
    undefined,
    { type: "Upload", value: code },
    U.hex.decode(message.selector),
    salt,
  ]))
  return C.state.call(client)(
    "ContractsApi_instantiate",
    key,
  )
    .next((encodedResponse) => {
      return $contractsApiInstantiateResult.decode(U.hex.decode(encodedResponse))
    })
}

function findContractConstructorByLabel(label: string) {
  return contract.metadata.V3.spec.constructors.find((c) => c.label === label)
}

async function getContract(wasmFile: string, metadataFile: string) {
  const wasm = await Deno.readFile(wasmFile)
  const metadata = C.M.ContractMetadata.normalize(JSON.parse(
    await Deno.readTextFile(metadataFile),
  ))
  const deriveCodec = C.M.DeriveCodec(metadata.V3.types)
  return { wasm, metadata, deriveCodec }
}

function getFilePath(relativeFilePath: string) {
  return path.join(
    path.dirname(path.fromFileUrl(import.meta.url)),
    relativeFilePath,
  )
}

class SmartContract {
  readonly deriveCodec

  constructor(
    readonly metadata: C.M.ContractMetadata,
    readonly contractAddress: Uint8Array,
  ) {
    this.deriveCodec = C.M.DeriveCodec(metadata.V3.types)
  }

  call<Args extends any[]>(
    origin: Uint8Array,
    messageLabel: string,
    args: Args,
  ) {
    const message = this.#getMessageByLabel(messageLabel)!
    const [$args, $result] = this.#getMessageCodecs(message)
    const data = $args.encode([U.hex.decode(message.selector), ...args])
    const callData = U.hex.encode($contractsApiCallArgs.encode([
      origin,
      this.contractAddress,
      0n,
      undefined,
      undefined,
      data,
    ]))
    return C.state.call(client)(
      "ContractsApi_call",
      callData,
    )
      .next((encodedResponse) => {
        const response = $contractsApiCallResult.decode(U.hex.decode(encodedResponse))
        if (message.returnType === null) {
          return undefined
        }
        return $result.decode(response.result.data)
      })
  }

  tx<Args extends unknown[]>(
    origin: Uint8Array,
    messageLabel: string,
    args: Args,
    sign: C.Z.$<C.M.Signer>,
  ) {
    const message = this.#getMessageByLabel(messageLabel)!
    const [$args, _] = this.#getMessageCodecs(message)
    const data = $args.encode([U.hex.decode(message.selector), ...args])
    const value = this.#preSubmitContractCallDryRunGasEstimate(origin, data)
      .next(({ gasRequired }) => {
        return {
          type: "call",
          dest: C.MultiAddress.Id(this.contractAddress),
          value: 0n,
          data,
          gasLimit: {
            refTime: gasRequired.refTime,
            proofSize: gasRequired.proofSize,
          },
          storageDepositLimit: undefined,
        }
      })
    const tx = C.extrinsic(client)({
      sender: C.MultiAddress.Id(origin),
      call: C.Z.rec({
        type: "Contracts",
        value,
      }),
    })
      .signed(sign)
    const finalizedIn = tx.watch(({ end }) =>
      (status) => {
        if (typeof status !== "string" && (status.inBlock ?? status.finalized)) {
          return end(status.inBlock ?? status.finalized)
        } else if (C.rpc.known.TransactionStatus.isTerminal(status)) {
          return end(new Error())
        }
        return
      }
    )
    return C.Z.ls(finalizedIn, C.events(tx, finalizedIn))
  }

  // TODO: codegen each contract message as a method

  #getMessageByLabel(label: string) {
    return this.metadata.V3.spec.messages.find((c) => c.label === label)
  }

  #getMessageCodecs(
    message: C.M.ContractMetadata.Message,
  ): [C.$.Codec<unknown[]>, C.$.Codec<any>] {
    const argCodecs = [
      // message selector
      C.$.sizedUint8Array(U.hex.decode(message.selector).length),
      // message args
      ...message.args.map((arg) => this.deriveCodec(arg.type.type)),
    ]
    const $result = message.returnType !== null
      ? this.deriveCodec(message.returnType.type)
      : C.$.constant(null)
    // @ts-ignore ...
    return [C.$.tuple(...argCodecs), $result]
  }

  #preSubmitContractCallDryRunGasEstimate(
    origin: Uint8Array,
    data: Uint8Array,
  ) {
    const callData = U.hex.encode($contractsApiCallArgs.encode([
      origin,
      this.contractAddress,
      0n,
      undefined,
      undefined,
      data,
    ]))
    return C.state.call(client)(
      "ContractsApi_call",
      callData,
    )
      .next((encodedResponse) => {
        return $contractsApiCallResult.decode(U.hex.decode(encodedResponse))
      })
  }
}

const flipperContract = new SmartContract(contract.metadata, contractAddress)
console.log(".get", await flipperContract.call(T.alice.publicKey, "get", []).run())
console.log(
  "block hash and events",
  U.throwIfError(await flipperContract.tx(T.alice.publicKey, "flip", [], T.alice.sign).run())[0],
)
console.log(".get", await flipperContract.call(T.alice.publicKey, "get", []).run())
console.log(".get_count", await flipperContract.call(T.alice.publicKey, "get_count", []).run())
console.log(
  ".inc block hash",
  U.throwIfError(await flipperContract.tx(T.alice.publicKey, "inc", [], T.alice.sign).run())[0],
)
console.log(
  ".inc block hash",
  U.throwIfError(await flipperContract.tx(T.alice.publicKey, "inc", [], T.alice.sign).run())[0],
)
console.log(".get_count", await flipperContract.call(T.alice.publicKey, "get_count", []).run())
console.log(
  ".inc_by(3) block hash",
  U.throwIfError(await flipperContract.tx(T.alice.publicKey, "inc_by", [3], T.alice.sign).run())[0],
)
console.log(".get_count", await flipperContract.call(T.alice.publicKey, "get_count", []).run())
console.log(
  ".m1(2,true) (multiple args/results)",
  await flipperContract.call(T.alice.publicKey, "m1", [2, true]).run(),
)
console.log(
  ".m2(3,false) (multiple args/results)",
  await flipperContract.call(T.alice.publicKey, "m1", [3, false]).run(),
)

await zombienet.close()
