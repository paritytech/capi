import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const root = new C.EntryRead(C.polkadot, "System", "Events", []);

console.log(U.throwIfError(await C.run(root)));
