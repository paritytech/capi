import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const root = new C.RpcSubscription(T.polkadot, "chain_subscribeNewHead", [], (stop) => {
  let i = 0;
  return (m) => {
    i++;
    if (i > 5) {
      stop();
    }
    console.log(m);
  };
});

U.throwIfError(await C.run(root));
