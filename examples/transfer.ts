import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const root = C.extrinsic({
  client: T.westend,
  sender: {
    type: "Id",
    value: T.alice.publicKey,
  },
  palletName: "Balances",
  methodName: "transfer",
  args: {
    value: 12345n,
    dest: {
      type: "Id",
      value: T.bob.publicKey,
    },
  },
})
  .signed((message) => ({
    type: "Sr25519",
    value: T.alice.sign(message),
  }))
  .watch(function(status) {
    console.log(status);
    if (C.TransactionStatus.isTerminal(status)) {
      this.stop();
    }
  });

U.throwIfError(await root.run());
