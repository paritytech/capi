import * as test from "../test-util/mod.ts";

const node = await test.node();

const result = await test
  .chain(node)
  .metadata()
  .read();

node.close();

console.log({ result });
