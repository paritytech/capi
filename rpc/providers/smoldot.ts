import { Config } from "../../config/mod.ts";
import type * as smoldot from "../../deps/smoldot.ts";
import { ErrorCtor } from "../../util/mod.ts";
import { Client, OnMessage } from "../Base.ts";
import { FailedToSendMessageError, ParseRawIngressMessageError } from "../common.ts";

export async function smoldotClient<Config_ extends Config<string>>(
  config: Config_,
): Promise<SmoldotClient<Config_> | FailedToStartSmoldotError | FailedToAddChainError> {
  const smoldotInstance = await ensureInstance();
  if (smoldotInstance instanceof Error) {
    return smoldotInstance;
  }
  const onMessageContainer: { onMessage?: (message: unknown) => void } = {};
  try {
    // TODO: wire up `onError`
    const chain = await smoldotInstance.addChain({
      chainSpec: config.discoveryValue,
      jsonRpcCallback: (response) => {
        onMessageContainer.onMessage?.(response);
      },
    });
    return new SmoldotClient(onMessageContainer, chain.remove);
  } catch (e) {
    return new FailedToAddChainError(e);
  }
}

export class SmoldotClient<Config_ extends Config<string>> extends Client<
  Config_,
  string,
  SmoldotInternalError,
  FailedToSendMessageError,
  FailedToRemoveChainError
> {
  #chain?: smoldot.Chain;

  constructor(
    onMessageContainer: { onMessage?: OnMessage<string> },
    readonly remove: () => void,
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
        send: async (egressMessage) => {
          try {
            return await this.#chain?.sendJsonRpc(JSON.stringify(egressMessage));
          } catch (error) {
            return new FailedToSendMessageError(error);
          }
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

export class FailedToStartSmoldotError extends ErrorCtor("FailedToStartSmoldot") {}
export class FailedToAddChainError extends ErrorCtor("FailedToAddChain") {
  constructor(readonly inner: unknown) {
    super();
  }
}
export class SmoldotInternalError extends ErrorCtor("SmoldotInternal") {}
// TODO: specify narrow `AlreadyDestroyedError` & `CrashError` from Smoldot
export class FailedToRemoveChainError extends ErrorCtor("FailedToRemoveChain") {
  constructor(readonly inner: unknown) {
    super();
  }
}
