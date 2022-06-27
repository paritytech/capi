import * as C from "../mod.ts";

const node = await C.test.node({ cloneDir: "./examples/substrate-template-node" });
const chain = C.test.chain(node);

const { alice, bob } = chain.address;

const result = chain
  .pallet("Balances")
  .extrinsic("transfer")
  .call({
    dest: alice.asPublicKeyBytes(),
    value: 12345n,
  })
  .signed(bob, bob.sign)
  .send();

for await (const event of result) {
  console.log({ event });
}

node.close();
