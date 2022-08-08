import * as C from "../mod.ts";
import * as t from "../test-util/mod.ts";

const config = await t.config();

const result = await C
  .chain(config)
  .metadata()
  .read();
console.log(result);

config.close();
