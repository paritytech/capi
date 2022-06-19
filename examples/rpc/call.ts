import { polkadotBeacon } from "../../known/mod.ts";
import { rpcClient } from "../../rpc/mod.ts";

const client = await rpcClient(polkadotBeacon);
const result = await client.call("state_getMetadata", []);
console.log(result);
await client.close();
