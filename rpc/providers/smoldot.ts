import type * as smoldot from "../../deps/smoldot.ts";
import { ErrorCtor } from "../../util/mod.ts";
import { Client } from "../Base.ts";
import { ClientHooks, ParseRawIngressMessageError, ProviderMethods } from "../common.ts";

export type SmoldotClientHooks<M extends ProviderMethods> = ClientHooks<M, SmoldotInternalError>;

export async function smoldotClient<M extends ProviderMethods>(
  chainSpec: string,
  hooks?: SmoldotClientHooks<M>,
): Promise<SmoldotClient<M> | FailedToStartSmoldotError | FailedToAddChainError> {
  const smoldotInstance = await ensureInstance();
  if (smoldotInstance instanceof Error) {
    return smoldotInstance;
  }
  const onMessageContainer: { onMessage?: (message: unknown) => void } = {};
  try {
    // TODO: wire up `onError`
    const chain = await smoldotInstance.addChain({
      chainSpec,
      jsonRpcCallback: (response) => {
        onMessageContainer.onMessage?.(response);
      },
    });
    return new SmoldotClient(onMessageContainer, chain.remove, hooks);
  } catch (_e) {
    return new FailedToAddChainError();
  }
}

export class SmoldotClient<M extends ProviderMethods>
  extends Client<M, SmoldotInternalError, string, unknown, FailedToRemoveChainError>
{
  #chain?: smoldot.Chain;

  constructor(
    onMessageContainer: {
      onMessage?: Client<
        M,
        SmoldotInternalError,
        string,
        unknown,
        FailedToRemoveChainError
      >["onMessage"];
    },
    readonly remove: () => void,
    hooks?: SmoldotClientHooks<M>,
  ) {
    super(
      {
        parse: {
          ingressMessage: (rawIngressMessage) => {
            try {
              return JSON.parse(rawIngressMessage);
            } catch (_e) {
              return new ParseRawIngressMessageError();
            }
          },
          error: (_e) => {
            return new SmoldotInternalError();
          },
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
