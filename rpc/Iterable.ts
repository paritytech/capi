import { deferred } from "../_deps/async.ts";
import { AnyMethods } from "../util/mod.ts";
import { AnyClient, StopListening } from "./Base.ts";
import * as msg from "./messages.ts";

export class Subscription<
  M extends AnyMethods,
  ParsedError extends Error,
  N extends Extract<keyof msg.NotifByMethodName<M>, keyof M>,
> implements AsyncIterableIterator<msg.NotifMessage<M, N> | msg.ErrMessage> {
  #queue: (msg.NotifMessage<M, N> | msg.ErrMessage)[] = [];
  #cbs: ((value: IteratorYieldResult<msg.NotifMessage<M, N> | msg.ErrMessage>) => void)[] = [];
  #stop?: StopListening;

  constructor(
    readonly client: AnyClient<M, ParsedError>,
    readonly method: N,
    readonly params: msg.InitMessage<M, N>["params"],
  ) {}

  #start = async (): Promise<undefined | msg.ErrMessage> => {
    const result = await this.client.subscribe(this.method, this.params, (ingressMessage) => {
      const cb = this.#cbs.shift();
      if (cb) {
        cb({
          done: false,
          value: ingressMessage,
        });
      } else {
        this.#queue.push(ingressMessage);
      }
    });
    if (typeof result === "function") {
      this.#stop = result;
      return;
    }
    return result;
  };

  async next(): Promise<IteratorResult<msg.NotifMessage<M, N> | msg.ErrMessage, undefined>> {
    if (!this.#stop) {
      const result = await this.#start();
      if (result?.error) {
        return {
          done: false,
          value: result,
        };
      }
    }
    if (this.#queue.length > 0) {
      return {
        done: false,
        value: this.#queue.shift()!,
      };
    }
    const pending = deferred<IteratorYieldResult<msg.NotifMessage<M, N> | msg.ErrMessage>>();
    this.#cbs.push(pending.resolve);
    return await pending;
  }

  async return(): Promise<IteratorReturnResult<void>> {
    this.#stop!();
    this.#stop = undefined;
    return {
      done: true,
      value: undefined,
    };
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}
