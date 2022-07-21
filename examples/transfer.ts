import * as test from "../test-util/mod.ts";

const node = await test.node();
const chain = test.chain(node);

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
