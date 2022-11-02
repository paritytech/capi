import { Config } from "../../config/mod.ts";
import type * as smoldot from "../../deps/smoldot.ts";
import { Client, OnMessage } from "../Base.ts";
import { ClientHooks, ParseRawIngressMessageError } from "../common.ts";

export type SmoldotClientHooks = ClientHooks<SmoldotInternalError>;

export async function smoldotClient(
  config: Config,
  hooks?: SmoldotClientHooks,
): Promise<SmoldotClient | FailedToStartSmoldotError | FailedToAddChainError> {
  const smoldotInstance = await ensureInstance();
  if (smoldotInstance instanceof Error) {
    return smoldotInstance;
  }
  const onMessageContainer: { onMessage?: (message: unknown) => void } = {};
  try {
    // TODO: wire up `onError`
    const chain = await smoldotInstance.addChain({
      chainSpec: await config.discoveryValue,
      jsonRpcCallback: (response) => {
        onMessageContainer.onMessage?.(response);
      },
    });
    return new SmoldotClient(onMessageContainer, chain.remove, hooks);
  } catch (e) {
    return new FailedToAddChainError(e);
  }
}

export class SmoldotClient extends Client<string, SmoldotInternalError, FailedToRemoveChainError> {
  #chain?: smoldot.Chain;

  constructor(
    onMessageContainer: { onMessage?: OnMessage<string> },
    readonly remove: () => void,
    hooks?: SmoldotClientHooks,
  ) {
    super(
      {
        parseIngressMessage: (rawIngressMessage) => {
          try {
            return JSON.parse(rawIngressMessage);
          } catch (_e) {
            return new ParseRawIngressMessageError();
          }
        },
        send: (egressMessage) => {
          this.#chain?.sendJsonRpc(JSON.stringify(egressMessage));
        },
        close: () => {
          return Promise.resolve((() => {
            try {
              this.remove();
              return;
            } catch (e) {
              return new FailedToRemoveChainError(e);
            }
          })());
        },
      },
      hooks,
    );
    onMessageContainer.onMessage = this.onMessage;
  }
}

const _state: { smoldotInstance?: smoldot.Client } = {};

async function ensureInstance(): Promise<smoldot.Client | FailedToStartSmoldotError> {
  if (!_state.smoldotInstance) {
    try {
      const smoldot = await import("../../deps/smoldot.ts");
      _state.smoldotInstance = smoldot.start();
    } catch (_e) {
      return new FailedToStartSmoldotError();
    }
  }
  return _state.smoldotInstance;
}

export class FailedToStartSmoldotError extends Error {
  override readonly name = "FailedToStartSmoldot";
}
export class FailedToAddChainError extends Error {
  override readonly name = "FailedToAddChain";
  constructor(readonly inner: unknown) {
    super();
  }
}
export class SmoldotInternalError extends Error {
  override readonly name = "SmoldotInternal";
}
// TODO: specify narrow `AlreadyDestroyedError` & `CrashError` from Smoldot
export class FailedToRemoveChainError extends Error {
  override readonly name = "FailedToRemoveChain";
  constructor(readonly inner: unknown) {
    super();
  }
}
