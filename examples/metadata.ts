import * as C from "../mod.ts";
import * as t from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const config = await t.config();

const root = C.metadata(config);

console.log(U.throwIfError(await root.run()));

config.close();
