import { deferred } from "../_deps/async.ts";
import { RpcClient, StopListening } from "./Base.ts";
import { RpcError } from "./Error.ts";
import * as M from "./messages.ts";

export class Subscription<Method extends M.SubscriptionMethodName>
  implements AsyncIterableIterator<M.NotifMessage<Method>>
{
  #queue: M.NotifMessage<Method>[] = [];
  #cbs: ((value: IteratorYieldResult<M.NotifMessage<Method>>) => void)[] = [];
  #stop?: StopListening;

  constructor(
    readonly client: RpcClient<RpcError>,
    readonly method: Method,
    readonly params: M.InitMessage<Method>["params"],
  ) {}

  #start = async () => {
    this.#stop = await this.client.subscribe(this.method, this.params, (ingressMessage) => {
      const cb = this.#cbs.shift();
      if (cb) {
        cb({ done: false, value: ingressMessage });
      } else {
        this.#queue.push(ingressMessage);
      }
    });
  };

  async next(): Promise<IteratorResult<M.NotifMessage<Method>, void>> {
    if (!this.#stop) {
      await this.#start();
    }
    if (this.#queue.length) {
      return {
        done: false,
        value: this.#queue.shift()!,
      };
    }
    const pending = deferred<IteratorYieldResult<M.NotifMessage<Method>>>();
    this.#cbs.push(pending.resolve);
    return pending;
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
