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
import { deferred } from "../../deps/std/async.ts"
import * as msg from "../messages.ts"
import { nextIdFactory, Provider, ProviderConnection, ProviderListener } from "./base.ts"
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
const connections = new Map<SmoldotProviderProps, SmoldotProviderConnection>()
class SmoldotProviderConnection
  extends ProviderConnection<Chain, SmoldotSendErrorData, SmoldotHandlerErrorData>
{}

const nextId = nextIdFactory()

export interface SmoldotProviderProps {
  relayChainSpec: string
  parachainSpec?: string
  // TODO: support deferring closing (how / what heuristic?)
  deferClosing?: boolean
}

export const smoldotProvider: Provider<
  SmoldotProviderProps,
  SmoldotSendErrorData,
  SmoldotHandlerErrorData,
  SmoldotCloseErrorData
> = (props, listener) => {
  return {
    nextId,
    send: (message) => {
      ;(async () => {
        let conn: SmoldotProviderConnection
        try {
          conn = await connection(props, listener)
        } catch (error) {
          listener(new ProviderHandlerError(error as SmoldotHandlerErrorData))
          return
        }
        try {
          conn.inner.sendJsonRpc(JSON.stringify(message))
        } catch (error) {
          listener(new ProviderSendError(error as SmoldotSendErrorData, message))
        }
      })()
    },
    release: () => {
      const conn = connections.get(props)
      if (!conn) {
        return Promise.resolve(undefined)
      }
      const { cleanUp, listeners, inner } = conn
      listeners.delete(listener)
      if (!listeners.size) {
        connections.delete(props)
        cleanUp()
        try {
          // TODO: utilize `deferClosing` prop once we flesh out approach
          inner.remove()
        } catch (e) {
          return Promise.resolve(new ProviderCloseError(e as SmoldotCloseErrorData))
        }
      }
      return Promise.resolve(undefined)
    },
  }
}

async function connection(
  props: SmoldotProviderProps,
  listener: ProviderListener<SmoldotSendErrorData, SmoldotHandlerErrorData>,
): Promise<SmoldotProviderConnection> {
  if (!client) {
    client = start(
      {
        forbidTcp: true,
        forbidNonLocalWs: true,
        cpuRateLimit: .25,
      } as ClientOptions,
    )
  }
  let conn = connections.get(props)
  if (!conn) {
    let inner: Chain
    if (props.parachainSpec) {
      const relayChainConnection = await client.addChain({
        chainSpec: props.relayChainSpec,
        disableJsonRpc: true,
      })
      inner = await client.addChain({
        chainSpec: props.parachainSpec,
        potentialRelayChains: [relayChainConnection],
      })
    } else {
      inner = await client.addChain({ chainSpec: props.relayChainSpec })
    }
    const stopListening = deferred<undefined>()
    conn = new SmoldotProviderConnection(inner, () => stopListening.resolve())
    connections.set(props, conn)
    ;(async () => {
      while (true) {
        try {
          const response = await Promise.race([
            stopListening,
            inner.nextJsonRpcResponse(),
          ])
          if (!response) {
            break
          }
          const message = msg.parse(response)
          conn!.forEachListener(message)
        } catch (e) {
          conn!.forEachListener(new ProviderHandlerError(e as SmoldotHandlerErrorData))
          break
        }
      }
    })()
  }
  conn.addListener(listener)
  return conn
}
