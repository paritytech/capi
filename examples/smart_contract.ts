import * as C from "http://localhost:5646/@local/mod.ts"
import * as T from "http://localhost:5646/@local/test_util/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"
import { $contractsApiCallArgs, $contractsApiCallResult } from "../frame_metadata/Contract.ts"

// const configFile = getFilePath("smart_contract/zombienet.toml")
// const zombienet = await T.zombienet.start(configFile)
// const client = zombienet.clients.byName["collator01"]!
const client = C.polkadot

const salt = Uint8Array.from(Array.from([0, 0, 0, 0]), () => Math.floor(Math.random() * 16))

const [code, metadataRaw] = await Promise.all([
  await Deno.readFile("examples/smart_contract/flipper.wasm"),
  await Deno.readTextFile("examples/smart_contract/metadata.json"),
])
const metadata = C.M.ContractMetadata.normalize(JSON.parse(metadataRaw))
const constructorMetadata = metadata.V3.spec.constructors.find((c) => c.label === "default")!

class ExtrinsicFailed extends Error {
  override readonly name = "ExtrinsicFailedError"
  constructor(
    override readonly cause: {
      event?: Record<string, any>
      phase: { value: number }
    },
  ) {
    super()
  }
}

const tx = C.contracts.instantiate(client)({
  code,
  constructorMetadata,
  salt,
  sender: T.alice.address,
}).signed(T.alice.sign)
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
const contractAddress = U.throwIfError(
  await C
    .events(tx, finalizedIn)
    .next((events) => {
      const extrinsicFailedEvent = events.find((e) =>
        e.event?.type === "System" && e.event?.value?.type === "ExtrinsicFailed"
      )
      if (extrinsicFailedEvent) {
        return new ExtrinsicFailed(extrinsicFailedEvent)
      }
      const event = events.find((e) =>
        e.event?.type === "Contracts" && e.event?.value?.type === "Instantiated"
      )
      return event?.event?.value.contract as Uint8Array
    })
    .run(),
)

// await zombienet.close()

interface MessageCodecs {
  $args: C.$.Codec<[Uint8Array, ...unknown[]]>
  $result: C.$.Codec<any>
}

class Contract<Client extends C.Z.Effect<C.rpc.Client>> {
  readonly deriveCodec
  readonly $events
  readonly $messageByLabel

  constructor(
    readonly client: Client,
    readonly metadata: C.M.ContractMetadata,
    readonly contractAddress: Uint8Array,
  ) {
    this.deriveCodec = C.M.DeriveCodec(metadata.V3.types)
    this.$messageByLabel = metadata.V3.spec.messages.reduce<Record<string, MessageCodecs>>(
      (acc, message) => {
        acc[message.label] = this.#getMessageCodecs(message)
        return acc
      },
      {},
    )
    this.$events = C.$.taggedUnion(
      "type",
      metadata.V3.spec.events
        .map((e) => [
          e.label,
          ["value", C.$.tuple(...e.args.map((a) => this.deriveCodec(a.type.type)))],
        ]),
    )
  }

  call<Args extends any[]>(
    origin: Uint8Array,
    messageLabel: string,
    args: Args,
  ) {
    const message = this.#getMessageByLabel(messageLabel)!
    const { $args, $result } = this.#getMessageCodecByLabel(messageLabel)
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
    const { $args } = this.#getMessageCodecByLabel(messageLabel)
    const data = $args.encode([U.hex.decode(message.selector), ...args])
    const callData = U.hex.encode($contractsApiCallArgs.encode([
      origin,
      this.contractAddress,
      0n,
      undefined,
      undefined,
      data,
    ]))
    const estimate = C.state.call(client)(
      "ContractsApi_call",
      callData,
    )
      .next((encodedResponse) => {
        return $contractsApiCallResult.decode(U.hex.decode(encodedResponse))
      })
    const value = estimate.next(({ gasRequired }) => {
      return {
        type: "call",
        dest: C.MultiAddress.Id(this.contractAddress),
        value: 0n,
        data,
        gasLimit: gasRequired,
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
      .next(([finalizedIn, events]) => {
        const contractEvents: any[] = events
          .filter(
            (e) => e.event?.type === "Contracts" && e.event?.value?.type === "ContractEmitted",
          )
          .map((e) => this.$events.decode(e.event?.value.data))
        return [finalizedIn, events, contractEvents]
      })
  }

  // TODO: codegen each contract message as a method

  #getMessageByLabel(label: string) {
    return this.metadata.V3.spec.messages.find((c) => c.label === label)
  }

  #getMessageCodecs(message: C.M.ContractMetadata.Message): MessageCodecs {
    return {
      $args: C.$.tuple(
        // message selector
        C.$.sizedUint8Array(U.hex.decode(message.selector).length),
        // message args
        ...message.args.map((arg) => this.deriveCodec(arg.type.type)),
      ),
      $result: message.returnType !== null
        ? this.deriveCodec(message.returnType.type)
        : C.$.constant(null),
    }
  }

  #getMessageCodecByLabel(label: string) {
    return this.$messageByLabel[label]!
  }
}

const prefix = U.throwIfError(await C.const(client)("System", "SS58Prefix").access("value").run())
console.log("Deployed Contract address", U.ss58.encode(prefix, contractAddress))

const flipperContract = new Contract(T.polkadot, metadata, contractAddress)
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
  ".inc_by_with_event(3) contract events",
  U.throwIfError(
    await flipperContract.tx(T.alice.publicKey, "inc_by_with_event", [3], T.alice.sign).run(),
  )[2],
)
console.log(
  ".method_returning_tuple(2,true)",
  await flipperContract.call(T.alice.publicKey, "method_returning_tuple", [2, true]).run(),
)
console.log(
  ".method_returning_struct(3,false)",
  await flipperContract.call(T.alice.publicKey, "method_returning_struct", [3, false]).run(),
)
