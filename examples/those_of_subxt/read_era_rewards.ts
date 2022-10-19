import * as C from "../../mod.ts";
import * as U from "../../util/mod.ts";

const raw = new C.EntryRead(C.polkadot, "Staking", "ActiveEra", []);
const idx = C.call(raw, (raw) => raw.value.index);
const eraRewardPoints = new C.EntryRead(C.polkadot, "Staking", "ErasRewardPoints", [idx]);

console.log(U.throwIfError(await C.run(eraRewardPoints)));
