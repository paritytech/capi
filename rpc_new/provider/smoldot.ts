/*
 Note: Smoldot Light client (and the integration with it) should not be treated as a
  provider - rather as a full node. Comparing to any other provider that may use a
  'url' to connect to, smoldot requires time to start up before start responding to rpc
  requests. Sync is needed for specific requests but some rpc calls can receive a response
  even prior to full sync of the light client.

  The approach here is mainly a "migration" (if I may say) from the substrate-connect
  code and logic. Tests in `smoldot.test.ts` file are 3 simpleones that covers the main
  cases of `AddChain`, `AddWellknownChain` and `Add a Parachain`.

  TODO: Discuss what else we may need to export/use from Smoldot
  Also discuss use cases that may not be too familiar
*/

import { MalformedJsonRpcError, QueueFullError } from "../../deps/smoldot.ts";
import { Chain as SmChain, Client, ClientOptions } from "../../deps/smoldot/client.d.ts";

import {
  AddChain,
  AddWellKnownChain,
  AlreadyDestroyedError,
  Chain,
  Config,
  CrashError,
  JsonRpcDisabledError,
  SClient,
  WellKnownChain,
} from "./smoldot-types.ts";

let startPromise: Promise<(options: ClientOptions) => Client> | null = null;
// Note that this can't be a set, as the same config is added/removed multiple times
const clientReferences: Config[] = [];
let clientPromise: Promise<Client> | Client | null = null;
let defaultMaxLogLevel = 3;

const getStart = () => {
  if (startPromise) return startPromise;
  startPromise = import("../../deps/smoldot.ts").then((sm) => sm.start);
  return startPromise;
};

const getWellknownSpec = async (supposedChain: WellKnownChain): Promise<string> => {
  let knownChainPath: string;
  switch (supposedChain) {
    case WellKnownChain.polkadot:
      knownChainPath = "./assets/polkadot.json";
      break;
    case WellKnownChain.ksmcc3:
      knownChainPath = "./assets/ksmcc3.json";
      break;
    case WellKnownChain.westend2:
      knownChainPath = "./assets/westend2.json";
      break;
    case WellKnownChain.rococo_v2_2:
      knownChainPath = "./assets/rococo_v2_2.json";
      break;
  }
  const spec = await import(knownChainPath, {
    assert: { type: "json" },
  });

  return JSON.stringify(spec.default);
};

// Must be passed the exact same object as was passed to {getClientAndIncRef}
const decRef = (config: Config) => {
  const idx = clientReferences.indexOf(config);
  if (idx === -1) throw new Error("Internal error within smoldot-light");
  clientReferences.splice(idx, 1);

  // Update `clientReferencesMaxLogLevel`
  // Note how it is set back to 3 if there is no reference anymore
  defaultMaxLogLevel = 3;
  for (const cfg of clientReferences.values()) {
    if (cfg.maxLogLevel && cfg.maxLogLevel > defaultMaxLogLevel) {
      defaultMaxLogLevel = cfg.maxLogLevel;
    }
  }

  if (clientReferences.length === 0) {
    if (clientPromise && !(clientPromise instanceof Promise)) {
      clientPromise.terminate();
    }
    clientPromise = null;
  }
};

// Wrapping the given function in order to catch errors for
const transformErrors = (fn: () => void) => {
  try {
    fn();
  } catch (e) {
    const error = e as Error | undefined;
    if (error?.name === "JsonRpcDisabledError") throw new JsonRpcDisabledError();
    if (error?.name === "CrashError") throw new CrashError(error.message);
    if (error?.name === "AlreadyDestroyedError") {
      throw new AlreadyDestroyedError();
    }
    throw new CrashError(
      e instanceof Error ? e.message : `Unexpected error ${e}`,
    );
  }
};

const getClientAndIncRef = (config: Config): Promise<Client> => {
  if (config.maxLogLevel && config.maxLogLevel > defaultMaxLogLevel) {
    defaultMaxLogLevel = config.maxLogLevel;
  }

  if (clientPromise) {
    clientReferences.push(config);
    if (clientPromise instanceof Promise) return clientPromise;
    else return Promise.resolve(clientPromise);
  }

  const newClientPromise = getStart().then((start) =>
    start({
      // In order to avoid confusing inconsistencies between browsers and NodeJS, TCP connections are always disabled.
      forbidTcp: true,
      // Prevents browsers from emitting warnings if smoldot tried to establish non-secure WebSocket connections
      forbidNonLocalWs: true,
      // The actual level filtering is done in the logCallback
      maxLogLevel: 9999999,
      // Politely limit the CPU usage of the smoldot background worker.
      cpuRateLimit: 0.5,
      logCallback: (level: number, target: string, message: string) => {
        if (level > defaultMaxLogLevel) return;

        // The first parameter of the methods of `console` has some printf-like substitution
        // capabilities. We don't really need to use this, but not using it means that the logs
        // might not get printed correctly if they contain `%`.
        if (level <= 1) {
          console.error("[%s] %s", target, message);
        } else if (level === 2) {
          console.warn("[%s] %s", target, message);
        } else if (level === 3) {
          console.info("[%s] %s", target, message);
        } else if (level === 4) {
          console.debug("[%s] %s", target, message);
        } else {
          console.trace("[%s] %s", target, message);
        }
      },
    })
  );

  clientPromise = newClientPromise;

  newClientPromise.then((client) => {
    // Make sure that the client we have just created is still desired
    if (clientPromise === newClientPromise) {
      clientPromise = client;
    } else {
      client.terminate();
    }
    // Note that if clientPromise != newClientPromise we know for sure that the client that we
    // return isn't going to be used. We would rather not return a terminated client, but this
    // isn't possible for type check reasons.
    return client;
  });

  clientReferences.push(config);
  return clientPromise;
};

export const smoldotClient = (config?: Config): SClient => {
  let client: Client;
  // Make config default to level 3 in case none is provided
  const configOrDefault = config || { maxLogLevel: 3 };

  const chains = new Map<Chain, SmChain>();

  const addChain: AddChain = async (
    chainSpec: string,
    jsonRpcCallback?: (msg: string) => void,
  ): Promise<Chain> => {
    client = await getClientAndIncRef(configOrDefault);

    try {
      const internalChain = await client.addChain({
        chainSpec,
        potentialRelayChains: [...chains.values()],
        disableJsonRpc: jsonRpcCallback === undefined,
      });
      (async () => {
        while (true) {
          let jsonRpcResponse;
          try {
            jsonRpcResponse = await internalChain.nextJsonRpcResponse();
          } catch (_) {
            break;
          }

          // `nextJsonRpcResponse` throws an exception if we pass `disableJsonRpc: true` in the
          // config. We pass `disableJsonRpc: true` if `jsonRpcCallback` is undefined. Therefore,
          // this code is never reachable if `jsonRpcCallback` is undefined.
          try {
            jsonRpcCallback!(jsonRpcResponse);
          } catch (error) {
            console.error("JSON-RPC callback has thrown an exception:", error);
          }
        }
      })();

      const chain: Chain = {
        sendJsonRpc: (rpc: any) => {
          transformErrors(() => {
            try {
              internalChain.sendJsonRpc(rpc);
            } catch (error) {
              if (error instanceof MalformedJsonRpcError) {
                // In order to expose the same behavior as the extension client, we silently
                // discard malformed JSON-RPC requests.
                return;
              } else if (error instanceof QueueFullError) {
                // If the queue is full, we immediately send back a JSON-RPC response indicating
                // the error.
                try {
                  const parsedRq = JSON.parse(rpc);
                  jsonRpcCallback!(
                    JSON.stringify({
                      jsonrpc: "v2",
                      id: parsedRq.id,
                      error: {
                        code: -32000,
                        message: "JSON-RPC server is too busy",
                      },
                    }),
                  );
                } catch (_error) {
                  // An error here counts as a malformed JSON-RPC request, which are ignored.
                }
              } else {
                throw error;
              }
            }
          });
        },
        remove: () => {
          try {
            transformErrors(() => {
              internalChain.remove();
            });
          } finally {
            chains.delete(chain);
            decRef(configOrDefault);
          }
        },
      };

      chains.set(chain, internalChain);
      return chain;
    } catch (error) {
      decRef(configOrDefault);
      throw error;
    }
  };

  const addWellKnownChain: AddWellKnownChain = async (
    supposedChain: WellKnownChain,
    jsonRpcCallback?: (msg: string) => void,
  ): Promise<Chain> => {
    try {
      getClientAndIncRef(configOrDefault);
      const chainSpec = await getWellknownSpec(supposedChain);
      return await addChain(chainSpec, jsonRpcCallback);
    } finally {
      decRef(configOrDefault);
    }
  };

  return { addChain, addWellKnownChain };
};
