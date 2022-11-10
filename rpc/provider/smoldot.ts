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
const connections = new Map<string, SmoldotProviderConnection>();
class SmoldotProviderConnection
  extends ProviderConnection<Chain, SmoldotSendErrorData, SmoldotHandlerErrorData>
{}

const nextId = nextIdFactory();

export const smoldotProvider: Provider<
  string,
  SmoldotSendErrorData,
  SmoldotHandlerErrorData,
  SmoldotCloseErrorData
> = (chainSpec, listener) => {
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
          conn.inner.sendJsonRpc(JSON.stringify(message));
        } catch (error) {
          listener(new ProviderSendError(error as SmoldotSendErrorData, message));
        }
      })();
    },
    release: async () => {
      const { cleanUp, listeners, inner } = await connection(chainSpec, listener);
      listeners.delete(listener);
      if (!listeners.size) {
        connections.delete(chainSpec);
        cleanUp();
        try {
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
  chainSpec: string,
  listener: ProviderListener<SmoldotSendErrorData, SmoldotHandlerErrorData>,
): Promise<SmoldotProviderConnection> {
  if (!client) {
    client = start(
      {
        forbidTcp: true,
        forbidNonLocalWs: true,
      } as ClientOptions,
    );
  }
  let conn = connections.get(chainSpec);
  if (!conn) {
    const inner = await client.addChain({ chainSpec });
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
