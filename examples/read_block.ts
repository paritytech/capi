import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const root = C.blockRead(C.polkadot)();

console.log(U.throwIfError(await C.run(root)));
