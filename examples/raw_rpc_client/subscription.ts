import * as C from "../../mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";

const client = U.throwIfError(await rpc.proxyClient(C.westend));

const maybeError = await client.subscribe("chain_subscribeAllHeads", [], (stop) => {
  let i = 1;
  return async (message) => {
    console.log({ [i++]: message.params.result });
    if (i > 5) {
      stop();
      await client.close();
    }
  };
});

if (maybeError) {
  console.log(maybeError);
}
