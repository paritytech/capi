import * as C from "../mod.ts";

const chain = C.test.chain();
const alice = await chain.addresses.alice.asPublicKeyBytes();
const result = await chain
  .pallet("System")
  .entry("Account", alice)
  .read();

console.log({ result });
