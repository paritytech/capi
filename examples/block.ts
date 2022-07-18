import * as C from "../mod.ts";

const node = await C.test.node();

const result = await C.test
  .chain(node)
  .block()
  .read();

node.close();

console.log({ result });
