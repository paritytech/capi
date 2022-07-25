import { Config } from "../../config/mod.ts";
import type * as smoldot from "../../deps/smoldot.ts";
import { ErrorCtor } from "../../util/mod.ts";
import { Client, OnMessage } from "../Base.ts";
import { ClientHooks, ParseRawIngressMessageError } from "../common.ts";

export type SmoldotClientHooks<Config_ extends Config<string>> = ClientHooks<
  Config_,
  SmoldotInternalError
>;

export async function smoldotClient<Config_ extends Config<string>>(
  config: Config_,
  hooks?: SmoldotClientHooks<Config_>,
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
    return new SmoldotClient(onMessageContainer, chain.remove, hooks);
  } catch (_e) {
    return new FailedToAddChainError();
  }
}

export class SmoldotClient<Config_ extends Config<string>>
  extends Client<Config_, string, SmoldotInternalError, FailedToRemoveChainError>
{
  #chain?: smoldot.Chain;

  constructor(
    onMessageContainer: { onMessage?: OnMessage<string> },
    readonly remove: () => void,
    hooks?: SmoldotClientHooks<Config_>,
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
            } catch (_e) {
              // TODO: differentiate between `AlreadyDestroyedError` & `CrashError`
              // if (e instanceof Error) {}
              return new FailedToRemoveChainError();
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

export class FailedToStartSmoldotError extends ErrorCtor("FailedToStartSmoldot") {}
export class FailedToAddChainError extends ErrorCtor("FailedToAddChain") {}
export class SmoldotInternalError extends ErrorCtor("SmoldotInternal") {}
export class FailedToRemoveChainError extends ErrorCtor("FailedToRemoveChain") {}
