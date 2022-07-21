import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";
import { rpcSubscription } from "../atoms/RpcSubscription.ts";
import { run } from "../run.ts";

await t.ctx(async (config) => {
  let i = 0;
  const subscription = rpcSubscription(config, "chain_subscribeNewHead", [], (close) => {
    return (m) => {
      i++;
      if (i > 5) {
        close();
      }
      console.log(m);
    };
  });
  U.throwIfError(await run(subscription));
});
