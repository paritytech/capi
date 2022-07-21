import * as t from "../test-util/mod.ts";

const node = await t.node();

const result = await t
  .chain(node)
  .pallet("System")
  .entry("Account")
  .keyPage(10)
  .read();

console.log({ result });

node.close();
