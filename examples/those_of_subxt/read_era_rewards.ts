import * as C from "../../mod.ts";
import * as U from "../../util/mod.ts";

const raw = new C.EntryRead(C.polkadot, "Staking", "ActiveEra", []);
const idx = C.sel(C.sel(raw, "value"), "start");
// TODO: `idx` throws cannot convert error
const eraRewardPoints = new C.EntryRead(C.polkadot, "Staking", "ErasRewardPoints", [idx]);

console.log(U.throwIfError(await C.run(eraRewardPoints)));
