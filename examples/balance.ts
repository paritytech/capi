import * as C from "../mod.ts";

const node = await C.test.node({ cloneDir: "./examples/substrate-template-node" });
const chain = C.test.chain(node);
const alice = await chain.address.alice.asPublicKeyBytes();
const result = await chain
  .pallet("System")
  .entry("Account", alice)
  .read();
console.log({ result });
node.close();
