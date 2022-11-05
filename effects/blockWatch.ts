import * as Z from "../deps/zones.ts";
import * as M from "../frame_metadata/mod.ts";
import * as known from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { blockRead } from "./blockRead.ts";
import { chain } from "./rpc/known.ts";

export function blockWatch<Client extends Z.$<rpc.Client>>(client: Client) {
  return (listener: U.Listener<known.SignedBlock<M.Extrinsic>, rpc.ClientSubscribeContext>) => {
    const listenerMapped = Z.call(listener, function mapBlockWatchListener(listener, env) {
      return async function(this: rpc.ClientSubscribeContext, header: known.Header) {
        const blockHash = chain.getBlockHash(client)(header.number);
        const block = await blockRead(client)(blockHash).run(env);
        if (block instanceof Error) throw block;
        listener.apply(this, [block]);
      };
    });
    const subscriptionId = chain.subscribeNewHeads(client)([], listenerMapped);
    return chain.unsubscribeNewHeads(client)(subscriptionId).zoned("BlockWatch");
  };
}
