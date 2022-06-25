import * as C from "../mod.ts";

const chain = C.test.chain();

const { alice, bob } = chain.addresses;

const result = chain
  .pallet("Balances")
  .extrinsic("transfer")
  .call({
    dest: alice,
    value: 12345n,
  })
  .signed(bob, bob.sign)
  .send();

for await (const event of result) {
  console.log({ event });
}
