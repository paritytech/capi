import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const root = new C.Metadata(T.polkadot);

console.log(U.throwIfError(await C.run(root)));
