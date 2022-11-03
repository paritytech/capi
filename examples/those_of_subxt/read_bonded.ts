import * as C from "../../mod.ts";
import * as T from "../../test_util/mod.ts";
import * as U from "../../util/mod.ts";

const client = await T.polkadot.client;

const aliceStash = T.alice.derive("//stash");

const aliceBonded = C.entryRead(client)("Staking", "Bonded", [aliceStash.publicKey]);

console.log(U.throwIfError(await C.run(aliceBonded)));
