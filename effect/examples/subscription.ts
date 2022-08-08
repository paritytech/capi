import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";
import * as Z from "../mod.ts";

const config = await t.config();

let i = 0;
const subscription = Z.rpcSubscription(config, "chain_subscribeNewHead", [], (stop) => {
  return (m) => {
    i++;
    if (i > 5) {
      stop();
    }
    console.log(m);
  };
});
U.throwIfError(await Z.run(subscription));

config.close();
