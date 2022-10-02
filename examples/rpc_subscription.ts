import * as C from "../mod.ts";
import * as t from "../test-util/mod.ts";
import * as U from "../util/mod.ts";

const config = await t.config();

const root = C.rpcSubscription(config, "chain_subscribeNewHead", [], (stop) => {
  let i = 0;
  return (m) => {
    i++;
    if (i > 5) {
      stop();
    }
    console.log(m);
  };
});

U.throwIfError(await root.run());

config.close();
