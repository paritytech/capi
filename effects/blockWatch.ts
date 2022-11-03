import * as Z from "../deps/zones.ts";
import * as M from "../frame_metadata/mod.ts";
import * as known from "../known/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { blockRead } from "./blockRead.ts";
import { chain } from "./rpc/known.ts";
import { run } from "./run.ts";

export function blockWatch<Client extends Z.$<rpc.Client>>(client: Client) {
  return (listener: U.Listener<known.SignedBlock<M.Extrinsic>, rpc.ClientSubscribeContext>) => {
    const listenerMapped = Z.call(listener, (listener) => {
      return async function(this: rpc.ClientSubscribeContext, header: known.Header) {
        // TODO: zones-level solution to this derivation
        const block = await run(
          blockRead(client)(chain.getBlockHash(client)(header.number)),
          ...[] as never,
        );
        if (block instanceof Error) throw block;
        listener.apply(this, [block]);
        return block;
      };
    });
    const subscriptionId = chain.subscribeNewHeads(client)([], listenerMapped);
    return chain.unsubscribeNewHeads(client)(subscriptionId);
  };
}
