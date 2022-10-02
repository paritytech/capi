import * as C from "../../mod.ts";
import * as rpc from "../../rpc/mod.ts";
import * as U from "../../util/mod.ts";

const client = U.throwIfError(await rpc.stdClient(C.westend));

console.log(await client.call("state_getMetadata", []));

await client.close();
