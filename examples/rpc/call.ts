#!/usr/bin/env -S deno run -A --no-check=remote

import * as C from "../../mod.ts";
import { wsRpcClient } from "../../rpc/mod.ts";

const client = await wsRpcClient(C.POLKADOT_RPC_URL);
const result = await client.call("state_getMetadata", []);
console.log(result);
await client.close();
