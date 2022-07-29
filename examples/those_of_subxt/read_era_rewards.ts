import * as Z from "../../effect/mod.ts";
import { polkadot } from "../../known/mod.ts";
import * as U from "../../util/mod.ts";

const activeEra = Z.readEntry(polkadot, "Staking", "ActiveEra", []);
const activeEraIndex = Z.select(Z.select(activeEra, "value"), "index");
const eraRewardPoints = Z.readEntry(polkadot, "Staking", "ErasRewardPoints", [activeEraIndex]);
const result = U.throwIfError(await Z.run(eraRewardPoints));
console.log(result);
