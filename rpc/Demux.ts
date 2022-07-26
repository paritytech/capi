import { Config } from "../config/mod.ts";
import { deferred } from "../deps/std/async.ts";
import { assert } from "../deps/std/testing/asserts.ts";
import * as U from "../util/mod.ts";
import { Client } from "./Base.ts";
import * as msg from "./messages.ts";

class DemuxGroup<Config_ extends Config> {
  members = new Map<U.WatchHandler<msg.NotifMessage<Config_>>, true>();

  constructor(readonly stop: () => void) {}
}

// TODO: decide whether this is even beneficial
export class Demux<
  Config_ extends Config,
  RawIngressMessage,
  InternalError,
  CloseError extends Error,
> {
  #groups = new Map<string, DemuxGroup<Config_>>();

  constructor(readonly client: Client<Config_, RawIngressMessage, InternalError, CloseError>) {}

  subscribe = async <MethodName extends Extract<keyof Config_["RpcSubscriptionMethods"], string>>(
    methodName: MethodName,
    params: Parameters<Config_["RpcSubscriptionMethods"][MethodName]>,
    createWatchHandler: U.CreateWatchHandler<msg.NotifMessage<Config_, MethodName>>,
  ): Promise<undefined | msg.ErrMessage<Config_>> => {
    const key = `${methodName}(${JSON.stringify(params)})`;
    let group = this.#groups.get(key);
    const status = deferred<undefined | msg.ErrMessage<Config_>>();
    if (!group) {
      const groupCreated = deferred();
      this.client.subscribe(methodName, params, (stop) => {
        group = new DemuxGroup(stop);
        groupCreated.resolve();
        this.#groups.set(key, group);
        return (message) => {
          assert(group);
          for (const watchWatchCb of group.members.keys()) {
            watchWatchCb(message);
          }
        };
      }).then(status.resolve);
      await groupCreated;
    }
    const stopWrapped = () => {
      assert(group);
      group.members.delete(watchWatchCb as any);
      if (group.members.size === 0) {
        group.stop();
        this.#groups.delete(key);
      }
    };
    const watchWatchCb = createWatchHandler(U.resolveOnCall(status, stopWrapped));
    assert(group);
    group.members.set(watchWatchCb as any, true);
    return status;
  };
}
