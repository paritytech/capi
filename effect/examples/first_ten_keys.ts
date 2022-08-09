import * as C from "../../mod.ts";
import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";

const config = await t.config();

const root = C.readKeyPage(config, "System", "Account", 10);

console.log(U.throwIfError(await root.run()).keys);

config.close();
