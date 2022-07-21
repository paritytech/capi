import * as test from "../test-util/mod.ts";

const node = await test.node();
const chain = test.chain(node);
const alice = await chain.address.alice.asPublicKeyBytes();
const result = await chain
  .pallet("System")
  .entry("Account", alice)
  .read();
console.log({ result });
node.close();
