import { start } from "../../deps/smoldot.ts";
import { Chain, Client, ClientOptions } from "../../deps/smoldot/client.d.ts";
import * as msg from "../messages.ts";
import { nextIdFactory, Provider, ProviderConnection, ProviderListener } from "./base.ts";
import { ProviderCloseError, ProviderHandlerError, ProviderSendError } from "./errors.ts";

// TODO
type SmoldotSendErrorData = any;
type SmoldotHandlerErrorData = any;
type SmoldotCloseErrorData = any;

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
        const conn = await connection(chainSpec, listener);
        try {
          return conn.inner.sendJsonRpc(JSON.stringify(message));
        } catch (e) {
          // TODO: funnel this to relevant handler(s)
          return new ProviderSendError(e);
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
          return inner.remove();
        } catch (e) {
          return new ProviderCloseError(e);
        }
      }
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
    // TODO: try catch this and send through handler within a `ProviderHandlerError`
    const inner = await client.addChain({ chainSpec });
    conn = new SmoldotProviderConnection(inner, () => {
      try {
        inner.remove();
      } catch (_e) { /* TODO */ }
    });
    connections.set(chainSpec, conn);
    const loop = async () => {
      try {
        conn!.forEachListener(msg.parse(await inner.nextJsonRpcResponse()));
      } catch (e) {
        conn!.forEachListener(new ProviderHandlerError(e));
        await loop();
      }
    };
    // TODO: should we be greedy & kick off a few additional?
    //       We don't want the inner buffer to overflow.
    loop();
    loop();
    loop();
  }
  conn.addListener(listener);
  return conn;
}
