import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const root = new C.EntryRead(C.westend, "System", "Events", []);

console.log(U.throwIfError(await root.run()));
