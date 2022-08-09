import * as C from "../../mod.ts";
import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";

const config = await t.config();

const aliceStash = t.alice.derive("//stash");
const aliceBonded = C.readEntry(config, "Staking", "Bonded", [aliceStash.publicKey]);

console.log(U.throwIfError(await aliceBonded.run()));

config.close();
