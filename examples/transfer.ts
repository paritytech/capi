import * as C from "../mod.ts";

const chain = C.test.chain();

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
