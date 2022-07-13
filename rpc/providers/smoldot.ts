import type * as smoldot from "../../_deps/smoldot.ts";
import { AnyMethods, ErrorCtor } from "../../util/mod.ts";
import * as B from "../Base.ts";
import { ClientHooks, ParseRawIngressMessageError } from "./common.ts";

export type SmoldotClientHooks<M extends AnyMethods> = ClientHooks<M, SmoldotInternalError>;

export async function smoldotClient<M extends AnyMethods>(
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

export class SmoldotClient<M extends AnyMethods>
  extends B.Client<M, SmoldotInternalError, string, unknown, FailedToRemoveChainError>
{
  #chain?: smoldot.Chain;

  constructor(
    onMessageContainer: {
      onMessage?: B.Client<
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
        close: async () => {
          try {
            this.remove();
            return;
          } catch (e) {
            if (e instanceof Error) {
              // TODO: handle the following in a special manner?
              // - `AlreadyDestroyedError`
              // - `CrashError`
            }
            return new FailedToRemoveChainError();
          }
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
      const smoldot = await import("../../_deps/smoldot.ts");
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
