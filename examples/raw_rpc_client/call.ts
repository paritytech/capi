import * as C from "../../mod.ts";
import * as rpc from "../../rpc/mod.ts";

const client = await rpc.stdClient(C.westend);
if (client instanceof Error) {
  throw client;
}

const result = await client.call("state_getMetadata", []);

console.log(result);

await client.close();
