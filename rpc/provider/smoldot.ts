import {
  AddChainError,
  AlreadyDestroyedError,
  CrashError,
  JsonRpcDisabledError,
  MalformedJsonRpcError,
  QueueFullError,
  start,
} from "../../deps/smoldot.ts"
import { Chain, Client, ClientOptions } from "../../deps/smoldot/client.d.ts"
import { abortable, retry, RetryOptions } from "../../deps/std/async.ts"
import * as U from "../../util/mod.ts"
import * as msg from "../messages.ts"
import { ListenersContainer } from "../mod.ts"
import { nextIdFactory, Provider, ProviderListener } from "./base.ts"
import { ProviderHandlerError, ProviderSendError } from "./errors.ts"

type SmoldotSendErrorData =
  | AlreadyDestroyedError
  | CrashError
  | JsonRpcDisabledError
  | MalformedJsonRpcError
  | QueueFullError
type SmoldotHandlerErrorData =
  | AlreadyDestroyedError
  | CrashError
  | JsonRpcDisabledError
  | AddChainError
type SmoldotCloseErrorData = AlreadyDestroyedError | CrashError

export interface SmoldotProviderFactoryProps {
  retryOptions?: RetryOptions
}

export interface SmoldotProviderProps {
  chainSpec: {
    relay: string
    para?: string
  }
  // TODO: support deferring closing (how / what heuristic?)
  deferClosing?: boolean
}

export const smoldotProviderFactory = (
  { retryOptions }: SmoldotProviderFactoryProps = {},
): Provider<
  SmoldotProviderProps,
  SmoldotSendErrorData,
  SmoldotHandlerErrorData,
  SmoldotCloseErrorData
> => {
  const nextId = nextIdFactory()
  const listenersContainer = new ListenersContainer<
    string,
    SmoldotSendErrorData,
    SmoldotHandlerErrorData
  >()
  const smoldotContainer = new SmoldotContainer(
    listenersContainer,
    retryOptions,
  )
  return (providerProps, listener) => {
    const providerKey = getProviderKey(providerProps)
    listenersContainer.set(providerKey, listener)
    const stopListeningController = new AbortController()
    return {
      nextId,
      send: (message) => {
        smoldotContainer.send(providerProps, listener, stopListeningController.signal, message)
      },
      release: () => {
        listenersContainer.delete(providerKey, listener)
        if (!listenersContainer.count(providerKey)) {
          stopListeningController.abort()
          // TODO: remove chain from smoldot client
        }
        return Promise.resolve(undefined)
      },
    }
  }
}

function getProviderKey({ chainSpec }: SmoldotProviderProps): string {
  return chainSpec.relay + chainSpec.para
}

class SmoldotContainer {
  client: Client | undefined
  clientChains = new Map<Client, Map<string, Promise<Chain>>>()

  constructor(
    readonly listenersContainer: ListenersContainer<
      string,
      SmoldotSendErrorData,
      SmoldotHandlerErrorData
    >,
    readonly retryOptions?: RetryOptions,
  ) {}

  send(
    providerProps: SmoldotProviderProps,
    listener: ProviderListener<SmoldotSendErrorData, SmoldotHandlerErrorData>,
    stopListeningSignal: AbortSignal,
    message: any,
  ): Promise<void> {
    return retry(async () => {
      const providerKey = getProviderKey(providerProps)
      const client = this.#getClient()
      // FIXME: on error remove from clientChains
      const clientChains = U.getOrInit(
        this.clientChains,
        client,
        () => new Map<string, Promise<Chain>>(),
      )
      try {
        // FIXME: on error remove from clientChains
        const chain = await U.getOrInit(
          clientChains,
          providerKey,
          async () => {
            let chain: Chain
            if (providerProps.chainSpec.para) {
              const relayChainConnection = await client.addChain({
                chainSpec: providerProps.chainSpec.relay,
                disableJsonRpc: true,
              })
              // FIXME: smoldot returns a new chain ref on every client.addChain
              chain = await client.addChain({
                chainSpec: providerProps.chainSpec.para,
                potentialRelayChains: [relayChainConnection],
              })
            } else {
              chain = await client.addChain({ chainSpec: providerProps.chainSpec.relay })
            }
            ;(async () => {
              while (true) {
                try {
                  const response = await abortable(chain.nextJsonRpcResponse(), stopListeningSignal)
                  this.listenersContainer.forEachListener(
                    providerKey,
                    msg.parse(response),
                  )
                } catch (error) {
                  if (error instanceof DOMException) { // abortable exception
                    break
                  }
                  this.#handleClientError(error, client)
                  this.listenersContainer.forEachListener(
                    providerKey,
                    new ProviderHandlerError(error as SmoldotHandlerErrorData),
                  )
                  break
                }
              }
            })()
            return chain
          },
        )
        return chain.sendJsonRpc(JSON.stringify(message))
      } catch (error) {
        if (error instanceof MalformedJsonRpcError || error instanceof QueueFullError) {
          listener(new ProviderSendError(error as SmoldotSendErrorData, message))
          return
        } else if (error instanceof AddChainError) {
          clientChains.delete(providerKey)
          listener(new ProviderSendError(error as SmoldotSendErrorData, message))
          return
        }
        this.#handleClientError(error, client)
        this.listenersContainer.forEachListener(
          providerKey,
          new ProviderHandlerError(error as SmoldotHandlerErrorData),
        )
      }
    }, this.retryOptions)
  }

  #getClient() {
    if (!this.client) {
      this.client = start(
        {
          forbidTcp: true,
          forbidNonLocalWs: true,
          cpuRateLimit: .25,
        } as ClientOptions,
      )
    }
    return this.client
  }

  #handleClientError(error: unknown, client: Client) {
    if (error instanceof AlreadyDestroyedError || error instanceof CrashError) {
      try {
        client.terminate()
      } catch (_error) {}
      // TODO: is this needed?
      // Is there an specific chain error?
      // Perhaps AddChainError?
      // this.clientChains.get(client)?.delete(providerProps)
      this.clientChains.delete(client)
      this.client = undefined
    }
  }
}

export const smoldotProvider = smoldotProviderFactory()
