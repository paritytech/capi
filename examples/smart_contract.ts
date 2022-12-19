// This example requires zombienet-macos/zombienet-linux, polkadot and polkadot-parachain binaries in the PATH

import * as path from "http://localhost:5646/@local/deps/std/path.ts"
import * as C from "http://localhost:5646/@local/mod.ts"
import * as T from "http://localhost:5646/@local/test_util/mod.ts"
import * as U from "http://localhost:5646/@local/util/mod.ts"

const configFile = path.join(
  path.dirname(path.fromFileUrl(import.meta.url)),
  "smart_contract/zombienet.toml",
)
const zombienet = await T.zombienet.start(configFile)
const client = zombienet.clients.byName["collator01"]!

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

class Contract<Client extends C.Z.Effect<C.rpc.Client>> {
  readonly $events

  constructor(
    readonly client: Client,
    readonly contractMetadata: C.M.ContractMetadata,
    readonly contractAddress: Uint8Array,
  ) {
    const deriveCodec = C.M.DeriveCodec(contractMetadata.V3.types)
    this.$events = C.$.taggedUnion(
      "type",
      contractMetadata.V3.spec.events
        .map((e) => [
          e.label,
          ["value", C.$.tuple(...e.args.map((a) => deriveCodec(a.type.type)))],
        ]),
    )
  }

  call<Args extends any[]>(
    sender: C.MultiAddress,
    messageLabel: string,
    args: Args,
  ) {
    const message = this.#getMessageByLabel(messageLabel)!
    return C.contracts.call(client)({
      sender,
      contractAddress: this.contractAddress,
      contractMetadata: this.contractMetadata,
      message,
      args,
    })
  }

  callTx<Args extends unknown[]>(
    sender: C.MultiAddress,
    messageLabel: string,
    args: Args,
    sign: C.Z.$<C.M.Signer>,
  ) {
    const message = this.#getMessageByLabel(messageLabel)!
    const tx = C.contracts.callTx(client)({
      sender,
      contractAddress: this.contractAddress,
      contractMetadata: this.contractMetadata,
      message,
      args,
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
          .filter((e) =>
            e.event?.type === "Contracts" && e.event?.value?.type === "ContractEmitted"
          )
          .map((e) => this.$events.decode(e.event?.value.data))
        return [finalizedIn, events, contractEvents]
      })
  }

  // TODO: codegen each contract message as a method

  #getMessageByLabel(label: string) {
    return this.contractMetadata.V3.spec.messages.find((c) => c.label === label)
  }
}

const prefix = U.throwIfError(await C.const(client)("System", "SS58Prefix").access("value").run())
console.log("Deployed Contract address", U.ss58.encode(prefix, contractAddress))

const flipperContract = new Contract(T.polkadot, metadata, contractAddress)
console.log(".get", await flipperContract.call(T.alice.address, "get", []).run())
console.log(
  "block hash and events",
  U.throwIfError(
    await flipperContract.callTx(T.alice.address, "flip", [], T.alice.sign).run(),
  )[0],
)
console.log(".get", await flipperContract.call(T.alice.address, "get", []).run())
console.log(".get_count", await flipperContract.call(T.alice.address, "get_count", []).run())
console.log(
  ".inc block hash",
  U.throwIfError(await flipperContract.callTx(T.alice.address, "inc", [], T.alice.sign).run())[0],
)
console.log(
  ".inc block hash",
  U.throwIfError(await flipperContract.callTx(T.alice.address, "inc", [], T.alice.sign).run())[0],
)
console.log(".get_count", await flipperContract.call(T.alice.address, "get_count", []).run())
console.log(
  ".inc_by(3) block hash",
  U.throwIfError(
    await flipperContract.callTx(T.alice.address, "inc_by", [3], T.alice.sign).run(),
  )[0],
)
console.log(".get_count", await flipperContract.call(T.alice.address, "get_count", []).run())
console.log(
  ".inc_by_with_event(3) contract events",
  U.throwIfError(
    await flipperContract.callTx(T.alice.address, "inc_by_with_event", [3], T.alice.sign).run(),
  )[2],
)
console.log(
  ".method_returning_tuple(2,true)",
  await flipperContract.call(T.alice.address, "method_returning_tuple", [2, true]).run(),
)
console.log(
  ".method_returning_struct(3,false)",
  await flipperContract.call(T.alice.address, "method_returning_struct", [3, false]).run(),
)

await zombienet.close()
