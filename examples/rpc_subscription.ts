import * as C from "../mod.ts";
import * as t from "../test-util/mod.ts";

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

const maybeError = await root.run();

if (maybeError instanceof Error) {
  throw maybeError;
}

config.close();
