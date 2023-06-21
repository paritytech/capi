import { metadata } from "@capi/polkadot"
import { hex } from "capi"
import { Client, ClientOptions, start } from "../../deps/smoldot.ts"
import { deferred, delay, retry } from "../../deps/std/async.ts"
import { relayChainSpec } from "./fetch_chainspec.eg.ts"

class RpcClient {
  client
  relayChain
  constructor(relayChainSpec: string, readonly debug = false) {
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

  chainHeadFollowStateMachine = createStateMachine(
    "idle",
    {
      idle: {
        onEnter(context) {
          context.finalizedBlockHash = undefined
          context.followSubscription = undefined
        },
        transitions: {
          initializing: {
            target: "initializing",
            action: () => {
              this.#send(this.#nextId(), "chainHead_unstable_follow", [false])
            },
          },
        },
      },
      initializing: {
        transitions: {
          initialized: {
            target: "initialized",
            action(context, meta) {
              context.finalizedBlockHash = meta.params.result.finalizedBlockHash
              context.followSubscription = meta.params.subscription
            },
          },
        },
      },
      initialized: {
        onEnter: (context) => {
          this.pendingStorageRequests.forEach(([id, method, params]) =>
            this.#send(
              id,
              method,
              // TODO: support other methods pending requests that require subscription + blockHash
              method === "chainHead_unstable_storage"
                ? [
                  context.followSubscription,
                  context.finalizedBlockHash,
                  ...params,
                ]
                : params,
            )
          )
          this.pendingStorageRequests = []
        },
        transitions: {
          finalized: {
            target: "initialized",
            action: (context, meta) => {
              context.finalizedBlockHash = (meta.params.result.finalizedBlockHashes as string[])
                .pop()!
              ;[
                ...meta.params.result.finalizedBlockHashes,
                ...meta.params.result.prunedBlockHashes,
              ].forEach((blockHash) => {
                this.#send(this.#nextId(), "chainHead_unstable_unpin", [
                  context.followSubscription,
                  blockHash,
                ])
              })
            },
          },
          stop: { target: "idle" },
          // See https://paritytech.github.io/json-rpc-interface-spec/api/chainHead.html#usage
          // TODO: handle newBlock?
          // TODO: handle bestBlockChanged?
        },
      },
    },
    {} as {
      followSubscription?: string
      finalizedBlockHash?: string
    },
  )
  pendingStorageRequests: [id: number, method: string, params: string[]][] = []
  async chainHeadStorage(key: string) {
    const id = this.#nextId()
    if (this.chainHeadFollowStateMachine.value === "idle") {
      this.chainHeadFollowStateMachine.transition("initializing")
      this.pendingStorageRequests.push([id, "chainHead_unstable_storage", [key]])
    } else if (this.chainHeadFollowStateMachine.value === "initializing") {
      this.pendingStorageRequests.push([id, "chainHead_unstable_storage", [key]])
    } else if (this.chainHeadFollowStateMachine.value === "initialized") {
      this.#send(id, "chainHead_unstable_storage", [
        this.chainHeadFollowStateMachine.context.followSubscription,
        this.chainHeadFollowStateMachine.context.finalizedBlockHash,
        key,
      ])
    } else {
      throw new Error("unable to read storage")
    }
    return await this.#subscribe(id, "done", ["inaccessible"])
  }

  async #send(id: number, method: string, params: any[]) {
    const message = {
      jsonrpc: "2.0",
      id,
      method,
      params,
    }
    this.#debug(">>>", message)
    ;(await this.relayChain).sendJsonRpc(JSON.stringify(message))
  }

  #onMessage(message: Record<string, any>) {
    if (isMessageOf(message, "chainHead_unstable_followEvent")) {
      this.chainHeadFollowStateMachine.transition(message.params.result.event, message)
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
      // TODO: break with AbortController
      const message = JSON.parse(await chain.nextJsonRpcResponse())
      this.#debug("<<<", message)
      this.#onMessage(message)
    }
  }

  pendingResponses = new Map<number, (message: Record<string, any>) => void>()
  subscriptions = new Map<string, (message: Record<string, any>) => void>()
  #subscribe(id: number, resolveEvent: string, rejectEvents: string[]) {
    const result = deferred<Record<string, any>>()
    this.pendingResponses.set(id, (message) => {
      this.pendingResponses.delete(id)
      if (!message.result) return result.reject(message)
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

  #debug(...args: any[]) {
    this.debug && console.log(...args)
  }
}

function isMessageOf(message: Record<string, any>, method: string, event?: string) {
  return message.method === method
    && (!event || message.params.result.event === event)
}

type StateDefinition<TContext> = {
  onEnter?: (context: TContext) => void
  onExit?: (context: TContext) => void
  transitions: Record<string, { target: string; action?: (context: TContext, meta: any) => void }>
}

type StateMachineDefinition<TContext> = { [state: string]: StateDefinition<TContext> }

function createStateMachine<TContext>(
  initialState: string,
  stateMachineDefinition: StateMachineDefinition<TContext>,
  context: TContext,
) {
  return {
    value: initialState,
    context,
    transition(event: string, eventMeta?: any) {
      const currentStateDefinition = stateMachineDefinition[this.value]
      const destinationTransition = currentStateDefinition?.transitions[event]
      if (!destinationTransition) {
        console.log(`Unhandled transition from "${this.value}" for "${event}"`)
        return
      }
      const destinationState = destinationTransition.target
      const destinationStateDefinition = stateMachineDefinition[destinationState]
      currentStateDefinition.onExit?.(this.context)
      destinationTransition.action?.(this.context, eventMeta)
      destinationStateDefinition?.onEnter?.(this.context)
      this.value = destinationState
      return this.value
    },
  }
}

async function readTimestampNow() {
  return retry(async () => {
    const chainHeadStorage = await rpcClient.chainHeadStorage(
      hex.encodePrefixed(metadata.pallets.Timestamp.storage.Now.key.encode()),
    )
    return metadata.pallets.Timestamp.storage.Now.value.decode(
      hex.decode(chainHeadStorage.params.result.value),
    )
  })
}

const rpcClient = new RpcClient(relayChainSpec)

console.log({ timestampNow: await readTimestampNow() })
await delay(6000)
console.log({ timestampNow: await readTimestampNow() })
await delay(6000)
console.log({ timestampNow: await readTimestampNow() })
await delay(6000)
console.log({ timestampNow: await readTimestampNow() })

// TODO: stop rpcClient
