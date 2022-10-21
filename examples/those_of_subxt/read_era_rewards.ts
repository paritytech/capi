import * as C from "../../mod.ts";
import * as U from "../../util/mod.ts";

const raw = new C.EntryRead(C.westend, "Staking", "ActiveEra", []);
const idx = C.sel(C.sel(raw, "value"), "index");
const eraRewardPoints = new C.EntryRead(C.westend, "Staking", "ErasRewardPoints", [idx]);

console.log(U.throwIfError(await C.run(eraRewardPoints)));
