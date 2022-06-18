#!/usr/bin/env -S deno run -A --no-check=remote

import * as C from "../../mod.ts";
import { wsRpcClient } from "../../rpc/mod.ts";

const client = await wsRpcClient(C.POLKADOT_RPC_URL);
const stop = await client.subscribe("chain_subscribeAllHeads", [], (message) => {
  console.log(message.params.result);
});
setTimeout(async () => {
  stop();
  await client.close();
}, 100000);
