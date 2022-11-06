import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const root = C.extrinsic({
  client: T.westend,
  sender: {
    type: "Id",
    value: T.alice.publicKey,
  },
  palletName: "Utility",
  methodName: "batch_all",
  args: {
    calls: [T.bob, T.charlie, T.dave, T.eve].map(({ publicKey }) => ({
      type: "Balances",
      value: {
        type: "transfer",
        dest: {
          type: "Id",
          value: publicKey,
        },
        value: 12345n,
      },
    })),
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
