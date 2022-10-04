import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const root = new C.KeyPageRead(T.polkadot, "System", "Account", 10);

console.log(U.throwIfError(await root.run()).keys);
