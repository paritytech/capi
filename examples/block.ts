import * as C from "../mod.ts";
import * as t from "../test-util/mod.ts";
import * as U from "../util/mod.ts";

const config = await t.config();

const root = C
  .chain(config)
  .block()
  .read();

console.log(U.throwIfError(await root.run()));

config.close();
