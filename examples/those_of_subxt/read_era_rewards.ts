import * as C from "../../mod.ts";
import * as U from "../../util/mod.ts";

const activeEra = C.readEntry(C.polkadot, "Staking", "ActiveEra", []);
const activeEraIndex = C.select(C.select(activeEra, "value"), "index");
const eraRewardPoints = C.readEntry(C.polkadot, "Staking", "ErasRewardPoints", [activeEraIndex]);

console.log(U.throwIfError(await eraRewardPoints.run()));
