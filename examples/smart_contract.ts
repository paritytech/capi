import * as path from "http://localhost:5646/@local/deps/std/path.ts"
import * as C from "http://localhost:5646/@local/mod.ts"
import * as T from "http://localhost:5646/@local/test_util/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"
import { $contractsApiCallArgs, $contractsApiCallReturn } from "../frame_metadata/Contract.ts"

const configFile = getFilePath("smart_contract/zombienet.toml")
const zombienet = await T.zombienet.start(configFile)
const client = zombienet.clients.byName["collator01"]!

const contract = await getContract(
  getFilePath("smart_contract/flipper.wasm"),
  getFilePath("smart_contract/metadata.json"),
)

const contractAddress = U.throwIfError(await instantiateContractTx().run())
console.log("Deployed Contract address", U.ss58.encode(42, contractAddress))
console.log("get message", U.throwIfError(await sendGetMessage(contractAddress).run()))
console.log("flip message in block", U.throwIfError(await sendFlipMessage(contractAddress).run()))
console.log("get message", U.throwIfError(await sendGetMessage(contractAddress).run()))

await zombienet.close()

function instantiateContractTx() {
  const constructor = findContractConstructorByLabel("default")!
  const tx = C.extrinsic(client)({
    sender: T.alice.address,
    call: {
      type: "Contracts",
      value: {
        type: "instantiateWithCode",
        value: 0n,
        // TODO: create sendDryRunContractInitiate and fetch these gasLimit value
        gasLimit: {
          refTime: 200_000_000_000n,
          proofSize: 0n,
        },
        storageDepositLimit: undefined,
        code: contract.wasm,
        data: U.hex.decode(constructor.selector),
        salt: Uint8Array.from(Array.from([0, 0, 0, 0]), () => Math.floor(Math.random() * 16)),
      },
    },
  })
    .signed(T.alice.sign)
  const finalizedIn = tx.watch(({ end }) =>
    (status) => {
      // .watch emits a single inBlock event
      if (typeof status !== "string" && status.inBlock) {
        return end(status.inBlock)
      } else if (C.rpc.known.TransactionStatus.isTerminal(status)) {
        return end(new Error())
      }
      return
    }
  )
  return C.events(tx, finalizedIn).next((events) => {
    const event = events.find((e) =>
      e.event?.type === "Contracts" && e.event?.value?.type === "Instantiated"
    )
    return event?.event?.value.contract as Uint8Array
  })
}

function sendMessageDryRunContractCall(
  address: Uint8Array,
  message: C.M.ContractMetadata.Message | C.M.ContractMetadata.Constructor,
) {
  const key = U.hex.encode($contractsApiCallArgs.encode([
    T.alice.publicKey,
    address,
    0n,
    undefined,
    undefined,
    U.hex.decode(message.selector),
  ]))
  return C.state.call(client)(
    "ContractsApi_call",
    key,
  )
    .next((encodedResponse) => {
      return $contractsApiCallReturn.decode(U.hex.decode(encodedResponse))
    })
}

function sendGetMessage(address: Uint8Array) {
  const message = findContractMessageByLabel("get")!
  const key = U.hex.encode($contractsApiCallArgs.encode([
    T.alice.publicKey,
    address,
    0n,
    undefined,
    undefined,
    U.hex.decode(message.selector),
  ]))
  return C.state.call(client)(
    "ContractsApi_call",
    key,
  )
    .next((encodedResponse) => {
      const response = $contractsApiCallReturn.decode(U.hex.decode(encodedResponse))
      if (message.returnType.type === null) {
        return undefined
      }
      return contract.deriveCodec(message.returnType.type).decode(response.result.data)
    })
}

function sendFlipMessage(address: Uint8Array) {
  const message = findContractMessageByLabel("flip")!
  const value = sendMessageDryRunContractCall(address, message)
    .next(({ gasRequired }) => {
      return {
        type: "call",
        dest: C.MultiAddress.Id(address),
        value: 0n,
        data: U.hex.decode(message.selector),
        gasLimit: {
          refTime: gasRequired.refTime,
          proofSize: gasRequired.proofSize,
        },
        storageDepositLimit: undefined,
      }
    })
  return C.extrinsic(client)({
    sender: T.alice.address,
    call: C.Z.rec({
      type: "Contracts",
      value,
    }),
  })
    .signed(T.alice.sign)
    .watch(({ end }) =>
      (status) => {
        // .watch emits a single inBlock event
        if (typeof status !== "string" && status.inBlock) {
          return end(status.inBlock)
        } else if (C.rpc.known.TransactionStatus.isTerminal(status)) {
          return end(new Error())
        }
        return
      }
    )
}

function findContractConstructorByLabel(label: string) {
  return contract.metadata.V3.spec.constructors.find((c) => c.label === label)
}

function findContractMessageByLabel(label: string) {
  return contract.metadata.V3.spec.messages.find((c) => c.label === label)
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
