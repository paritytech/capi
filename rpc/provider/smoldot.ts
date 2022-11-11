import {
  AddChainError,
  AlreadyDestroyedError,
  CrashError,
  JsonRpcDisabledError,
  MalformedJsonRpcError,
  QueueFullError,
  start,
} from "../../deps/smoldot.ts";
import { Chain, Client, ClientOptions } from "../../deps/smoldot/client.d.ts";
import { deferred } from "../../deps/std/async.ts";
import * as msg from "../messages.ts";
import { nextIdFactory, Provider, ProviderConnection, ProviderListener } from "./base.ts";
import { ProviderCloseError, ProviderHandlerError, ProviderSendError } from "./errors.ts";

type SmoldotSendErrorData =
  | AlreadyDestroyedError
  | CrashError
  | JsonRpcDisabledError
  | MalformedJsonRpcError
  | QueueFullError;
type SmoldotHandlerErrorData =
  | AlreadyDestroyedError
  | CrashError
  | JsonRpcDisabledError
  | AddChainError;
type SmoldotCloseErrorData = AlreadyDestroyedError | CrashError;

let client: undefined | Client;
const connections = new Map<SmoldotProviderProps, SmoldotProviderConnection>();
class SmoldotProviderConnection
  extends ProviderConnection<Chain, SmoldotSendErrorData, SmoldotHandlerErrorData>
{}

const nextId = nextIdFactory();

export interface SmoldotProviderProps {
  relayChainSpec: string;
  parachainSpec?: string;
  // TODO: support deferring closing (how / what heuristic?)
  deferClosing?: boolean;
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
      (async () => {
        let conn: SmoldotProviderConnection;
        try {
          conn = await connection(chainSpec, listener);
        } catch (error) {
          listener(new ProviderHandlerError(error as SmoldotHandlerErrorData));
          return;
        }
        try {
          return conn.inner.sendJsonRpc(JSON.stringify(message));
        } catch (error) {
          if (error instanceof MalformedJsonRpcError || error instanceof QueueFullError) {
            listener(new ProviderSendError(error, message));
            return;
          }
          conn.forEachListener(new ProviderSendError(error as SmoldotSendErrorData));
        }
      })();
    },
    release: async () => {
      const { cleanUp, listeners, inner } = await connection(props, listener);
      listeners.delete(listener);
      if (!listeners.size) {
        connections.delete(props);
        cleanUp();
        try {
          // TODO: utilize `deferClosing` prop once we flesh out approach
          inner.remove();
        } catch (e) {
          return new ProviderCloseError(e as SmoldotCloseErrorData);
        }
      }
      return;
    },
  };
};

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
    );
  }
  let conn = connections.get(props);
  if (!conn) {
    const innerMap: Chain[] = [];
    connections.forEach((value: SmoldotProviderConnection) => {
      innerMap.push(value.inner);
    });
    const inner = await client.addChain({
      chainSpec,
      potentialRelayChains: innerMap,
    });
    conn = new SmoldotProviderConnection(inner, () => {
      try {
        inner.remove();
      } catch (_e) { /* TODO */ }
    });
    connections.set(chainSpec, conn);
    (async () => {
      while (true) {
        try {
          const message = msg.parse(await inner.nextJsonRpcResponse());
          conn!.forEachListener(message);
        } catch (e) {
          conn!.forEachListener(new ProviderHandlerError(e as SmoldotHandlerErrorData));
          break;
        }
      }
    })();
  }
  conn.addListener(listener);
  return conn;
}
