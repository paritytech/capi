import * as C from "../mod.ts";

const { alice, bob } = C.test.addresses;

const result = C.test
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
