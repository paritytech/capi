import * as C from "../mod.ts";

const node = await C.test.node();
const chain = C.test.chain(node);

const { alice, bob } = chain.address;

await chain
  .pallet("Balances")
  .extrinsic("transfer")
  .call({
    dest: alice.asPublicKeyBytes(),
    value: 12345n,
  })
  .signed(bob, bob.sign)
  .send();

node.close();
