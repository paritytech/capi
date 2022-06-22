import * as C from "../mod.ts";

const chain = C.test.chain;
const { alice, bob } = chain.addresses;

const transferPending = chain
  .pallet("Balances")
  .extrinsic("transfer")
  .call({ dest: alice, value: 12345n })
  .signed(bob, bob.sign)
  .send();

const cancellationPending = transferPending
  .cancellation()
  .send();

await Promise.all([transferPending, cancellationPending].map(async (iter, i) => {
  for await (const event of iter) {
    console.log(`${
      {
        0: "Transfer ",
        1: "Transfer cancellation attempt",
      }[i as 0 | 1]
    } event: ${event}`);
  }
}));
