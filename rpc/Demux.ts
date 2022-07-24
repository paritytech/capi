import { deferred } from "../deps/std/async.ts";
import { assert } from "../deps/std/testing/asserts.ts";
import * as U from "../util/mod.ts";
import { Client, CreateListenerCb, ListenerCb, StopListening } from "./Base.ts";
import { ProviderMethods } from "./common.ts";
import * as msg from "./messages.ts";

class DemuxGroup<M extends ProviderMethods> {
  members = new Map<ListenerCb<msg.NotifMessage<M>>, true>();

  constructor(readonly stop: StopListening) {}
}

export class Demux<
  M extends ProviderMethods,
  ParsedError extends Error,
  RawIngressMessage,
  RawError,
  CloseError extends Error,
> {
  #groups = new Map<string, DemuxGroup<M>>();

  constructor(readonly client: Client<M, ParsedError, RawIngressMessage, RawError, CloseError>) {}

  subscribe = async <Method extends Extract<msg.SubscriptionMethodName<M>, keyof M>>(
    method: Method,
    params: msg.InitMessage<M, Method>["params"],
    createListenerCb: CreateListenerCb<msg.NotifMessage<M, Method>>,
  ): Promise<undefined | msg.ErrMessage> => {
    const key = `${method as string}(${JSON.stringify(params)})`;
    let group = this.#groups.get(key);
    const status = deferred<undefined | msg.ErrMessage>();
    if (!group) {
      const groupCreated = deferred();
      this.client.subscribe(method, params, (stop) => {
        group = new DemuxGroup(stop);
        groupCreated.resolve();
        this.#groups.set(key, group);
        return (message) => {
          assert(group);
          for (const listenerCb of group.members.keys()) {
            listenerCb(message);
          }
        };
      }).then(status.resolve);
      await groupCreated;
    }
    const stopWrapped = () => {
      assert(group);
      group.members.delete(listenerCb as any);
      if (group.members.size === 0) {
        group.stop();
        this.#groups.delete(key);
      }
    };
    const listenerCb = createListenerCb(U.resolveOnCall(status, stopWrapped));
    assert(group);
    group.members.set(listenerCb as any, true);
    return status;
  };
}
