import * as Z from "../deps/zones.ts";
import * as known from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { chain } from "./rpc_known.ts";

const k0_ = Symbol();

export function blockWatch<Client extends Z.$<rpc.Client>>(client: Client) {
  return <
    Listener extends Z.$<U.Listener<known.SignedBlock, rpc.ClientSubscribeContext>>,
  >(listener: Listener) => {
    const listenerMapped = Z
      .ls(listener, Z.env)
      .next(([listener, env]) => {
        return async function(this: rpc.ClientSubscribeContext, header: known.Header) {
          const blockHash = chain.getBlockHash(client)(header.number);
          const block = await chain.getBlock(client)(blockHash).bind(env)();
          // TODO: return error with `this.stop` once implemented
          if (block instanceof Error) throw block;
          listener.apply(this, [block]);
        };
      }, k0_);
    const subscriptionId = chain.subscribeNewHeads(client)([], listenerMapped);
    return chain
      .unsubscribeNewHeads(client)(subscriptionId)
      .zoned("BlockWatch");
  };
}
