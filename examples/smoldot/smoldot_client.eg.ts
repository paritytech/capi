import { metadata } from "@capi/polkadot"
import { hex } from "capi"
import { Client, ClientOptions, start } from "../../deps/smoldot.ts"
import { Deferred, deferred, delay } from "../../deps/std/async.ts"
import { relayChainSpec } from "./fetch_chainspec.eg.ts"

class RpcClient {
  client
  relayChain
  constructor(relayChainSpec: string) {
    this.client = start({
      forbidTcp: true,
      forbidNonLocalWs: true,
      cpuRateLimit: .25,
    } as ClientOptions) as Client
    this.relayChain = this.client.addChain({
      chainSpec: relayChainSpec,
    })
    this.#init()
  }

  async chainHeadStorage() {
    await this.chainHeadFollow()
    // FIXME: timebox await
    for (const _ of new Array(7)) {
      try {
        const { followSubscription, finalizedBlockHash } = await this.chainHeadFollowInitialized!

        const id = this.#nextId()
        this.#send(id, "chainHead_unstable_storage", [
          followSubscription,
          finalizedBlockHash,
          hex.encodePrefixed(metadata.pallets.Timestamp.storage.Now.key.encode()),
        ])
        return await this.#subscribe(id, "done", ["inaccessible"])
      } catch (error) {
        console.log({ error })
      }
      await delay(1000)
    }
    throw new Error("max attempts")
  }

  chainHeadFollowInitialized:
    | Deferred<{ followSubscription: string; finalizedBlockHash: string }>
    | undefined
  async chainHeadFollow() {
    if (this.chainHeadFollowInitialized) return
    this.chainHeadFollowInitialized = deferred()
    this.#send(this.#nextId(), "chainHead_unstable_follow", [true])
  }

  async #send(id: number, method: string, params: any[]) {
    const message = {
      jsonrpc: "2.0",
      id,
      method,
      params,
    }
    console.log(">>>", message)
    ;(await this.relayChain).sendJsonRpc(JSON.stringify(message))
  }

  #onMessage(message: Record<string, any>) {
    if (isMessageOf(message, "chainHead_unstable_followEvent", "initialized")) {
      this.chainHeadFollowInitialized?.resolve({
        followSubscription: message.params.subscription,
        finalizedBlockHash: message.params.result.finalizedBlockHash,
      })
    } else if (isMessageOf(message, "chainHead_unstable_followEvent", "stop")) {
      if (this.chainHeadFollowInitialized?.state === "pending") {
        this.chainHeadFollowInitialized.reject()
      }
      this.chainHeadFollowInitialized = undefined
    } else if (isMessageOf(message, "chainHead_unstable_followEvent", "newBlock")) {
      if (this.chainHeadFollowInitialized?.state === "pending") {
        this.chainHeadFollowInitialized?.resolve({
          followSubscription: message.params.subscription,
          finalizedBlockHash: message.params.result.blockHash,
        })
        return
      }
      this.chainHeadFollowInitialized = deferred()
      this.chainHeadFollowInitialized?.resolve({
        followSubscription: message.params.subscription,
        finalizedBlockHash: message.params.result.blockHash,
      })
    }

    if (message.id) {
      this.pendingResponses.get(message.id)?.(message)
    } else if (message.params?.subscription) {
      this.subscriptions.get(message.params?.subscription)?.(message)
    }
  }

  async #init() {
    const chain = await this.relayChain
    while (true) {
      const message = JSON.parse(await chain.nextJsonRpcResponse())
      console.log("<<<", message)
      this.#onMessage(message)
    }
  }

  pendingResponses = new Map<number, (message: Record<string, any>) => void>()
  subscriptions = new Map<string, (message: Record<string, any>) => void>()
  #subscribe(id: number, resolveEvent: string, rejectEvents: string[]) {
    const result = deferred<Record<string, any>>()
    this.pendingResponses.set(id, (message) => {
      this.pendingResponses.delete(id)
      if (!message.result) {
        return result.reject(message)
      }
      const subscriptionId = message.result
      this.subscriptions.set(subscriptionId, (message) => {
        if (message.error || rejectEvents.includes(message.params?.result.event)) {
          this.subscriptions.delete(subscriptionId)
          return result.reject(message)
        } else if (message.params?.result.event === resolveEvent) {
          this.subscriptions.delete(subscriptionId)
          return result.resolve(message)
        }
        console.log("ignored", message)
      })
    })
    return result
  }

  messageId = 0
  #nextId() {
    return ++this.messageId
  }
}

function isMessageOf(message: Record<string, any>, method: string, event: string) {
  return message.method === method
    && message.params.result.event === event
}

const rpcClient = new RpcClient(relayChainSpec)

const chainHeadStorage = await rpcClient.chainHeadStorage()

console.log({ chainHeadStorage })

console.log("2nd round")

await delay(5000)
const chainHeadStorage2 = await rpcClient.chainHeadStorage()

console.log({ chainHeadStorage2 })

console.log("2rd round")

await delay(5000)
const chainHeadStorage3 = await rpcClient.chainHeadStorage()
console.log({ chainHeadStorage3 })
