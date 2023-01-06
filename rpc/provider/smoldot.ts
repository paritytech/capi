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
import * as msg from "../messages.ts"
import { ListenersContainer } from "../mod.ts"
import { nextIdFactory, Provider, ProviderListener } from "./base.ts"
import { ProviderCloseError, ProviderHandlerError, ProviderSendError } from "./errors.ts"

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

let client: undefined | Client

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
    SmoldotProviderProps,
    SmoldotSendErrorData,
    SmoldotHandlerErrorData
  >()
  return (providerProps, listener) => {
    listenersContainer.set(providerProps, listener)
    const stopListeningController = new AbortController()
    let chain: Chain | undefined
    return {
      nextId,
      send: (message) => {
        ;(async () => {
          try {
            // FIXME: concurrent send may init the same chain multiple times
            chain = await getChain({
              providerProps,
              listener: (e) => listenersContainer.forEachListener(providerProps, e),
              stopListeningSignal: stopListeningController.signal,
              retryOptions,
            })
          } catch (error) {
            listener(new ProviderHandlerError(error as SmoldotHandlerErrorData))
            return
          }
          try {
            chain.sendJsonRpc(JSON.stringify(message))
          } catch (error) {
            listener(new ProviderSendError(error as SmoldotSendErrorData, message))
          }
        })()
      },
      release: () => {
        listenersContainer.delete(providerProps, listener)
        if (!listenersContainer.count(providerProps)) {
          stopListeningController.abort()
          try {
            // TODO: utilize `deferClosing` prop once we flesh out approach
            chain?.remove()
          } catch (e) {
            return Promise.resolve(new ProviderCloseError(e as SmoldotCloseErrorData))
          }
        }
        return Promise.resolve(undefined)
      },
    }
  }
}

export const smoldotProvider = smoldotProviderFactory()

interface GetChainProps {
  providerProps: SmoldotProviderProps
  listener: ProviderListener<SmoldotSendErrorData, SmoldotHandlerErrorData>
  stopListeningSignal: AbortSignal
  retryOptions?: RetryOptions
}

function getChain(
  { providerProps, listener, stopListeningSignal, retryOptions }: GetChainProps,
) {
  return retry(async () => {
    if (!client) {
      client = getOrResetClient()
    }
    let chain: Chain
    try {
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
    } catch (e) {
      if (e instanceof AlreadyDestroyedError || e instanceof CrashError) {
        getOrResetClient()
      }
      throw e
    }
    ;(async () => {
      while (true) {
        try {
          const response = await abortable(chain.nextJsonRpcResponse(), stopListeningSignal)
          listener(msg.parse(response))
        } catch (e) {
          if (e instanceof DOMException) {
            break
          } else if (e instanceof AlreadyDestroyedError || e instanceof CrashError) {
            getOrResetClient()
          }
          listener(new ProviderHandlerError(e as SmoldotHandlerErrorData))
          break
        }
      }
    })()
    return chain
  }, retryOptions)
}

function getOrResetClient() {
  try {
    // may throw AlreadyDestroyedError or CrashErrors
    client?.terminate()
  } catch (_error) {}
  client = start(
    {
      forbidTcp: true,
      forbidNonLocalWs: true,
      cpuRateLimit: .25,
    } as ClientOptions,
  )
  return client
}
