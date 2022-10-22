import { Config } from "../config/mod.ts";
import { deferred } from "../deps/std/async.ts";
import { assert } from "../deps/std/testing/asserts.ts";
import * as U from "../util/mod.ts";
import { Client } from "./Base.ts";
import * as msg from "./messages.ts";

class DemuxGroup {
  members = new Map<U.WatchHandler<msg.NotifMessage>, true>();

  constructor(readonly stop: () => void) {}
}

// TODO: decide whether this is even beneficial
export class Demux<
  Config_ extends Config,
  RawIngressMessage,
  InternalError,
  CloseError extends Error,
> {
  #groups = new Map<string, DemuxGroup>();

  constructor(readonly client: Client<Config_, RawIngressMessage, InternalError, CloseError>) {}

  subscribe = async (
    methodName: string,
    params: unknown[],
    createWatchHandler: U.CreateWatchHandler<msg.NotifMessage>,
  ): Promise<undefined | msg.ErrMessage> => {
    const key = `${methodName}(${JSON.stringify(params)})`;
    let group = this.#groups.get(key);
    const status = deferred<undefined | msg.ErrMessage>();
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
    const watchWatchCb = createWatchHandler(() => {
      stopWrapped();
      status.resolve();
    });
    assert(group);
    group.members.set(watchWatchCb as any, true);
    return status;
  };
}
