import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const client = await T.polkadot.client;

const root = C.metadata(client)();

console.log(U.throwIfError(await C.run(root)));
