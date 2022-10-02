import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const root = C.readEntry(C.westend, "System", "Events", []);

console.log(U.throwIfError(await root.run()));
