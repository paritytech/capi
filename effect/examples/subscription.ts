import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";
import * as Z from "../mod.ts";

await t.ctx(async (config) => {
  let i = 0;
  const subscription = Z.rpcSubscription(config, "chain_subscribeNewHead", [], (close) => {
    return (m) => {
      i++;
      if (i > 5) {
        close();
      }
      console.log(m);
    };
  });
  U.throwIfError(await Z.run(subscription));
});
