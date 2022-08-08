import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";
import * as Z from "../mod.ts";

const config = await t.config();

const read = Z.metadata(config);
const result = U.throwIfError(await read.run());
console.log(result);

config.close();
