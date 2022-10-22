import * as C from "../../mod.ts";
import * as U from "../../util/mod.ts";

const raw = C.Entry.read(C.westend, "Staking", "ActiveEra", []);
const idx = C.sel(C.sel(raw, "value"), "index");
const eraRewardPoints = C.Entry.read(C.westend, "Staking", "ErasRewardPoints", [idx]);

console.log(U.throwIfError(await C.run(eraRewardPoints)));
