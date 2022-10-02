import * as C from "../../mod.ts";
import * as rpc from "../../rpc/mod.ts";

const client = await rpc.stdClient(C.westend);
if (client instanceof Error) {
  throw client;
}

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
