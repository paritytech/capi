import * as C from "../../mod.ts";
import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";

const config = await t.config();

const root = C.readEntry(config, "System", "Account", [t.alice.publicKey]);

console.log(U.throwIfError(await root.run()));

config.close();
