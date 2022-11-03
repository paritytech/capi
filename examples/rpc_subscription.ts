import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const client = await T.polkadot.client;

const root = C.chain.unsubscribeNewHeads(client)(
  C.chain.subscribeNewHeads(client)([], function(header) {
    console.log(header);
    const counter = this.state(U.Counter);
    if (counter.i === 2) {
      return this.stop();
    }
    counter.inc();
  }),
);
U.throwIfError(await C.run(root));
