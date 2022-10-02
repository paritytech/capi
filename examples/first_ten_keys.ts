import * as C from "../mod.ts";
import * as t from "../test-util/mod.ts";

const config = await t.config();

const root = C.readKeyPage(config, "System", "Account", 10);

const result = await root.run();

if (result instanceof Error) {
  throw result;
}
console.log(result.keys);

config.close();
