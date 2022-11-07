import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const recipients = [T.bob, T.charlie, T.dave, T.eve];

const env = C.Z.env();

// TODO: uncomment these lines upon solving `count` in zones
// const getBalances = C.Z.ls(
//   ...recipients.map(({ publicKey }) => {
//     return C.entryRead(T.westend)("System", "Account", [publicKey])
//       .access("value").access("data").access("free");
//   }),
// ).bind(env);

const runTx = C.extrinsic({
  client: T.westend,
  sender: {
    type: "Id",
    value: T.alice.publicKey,
  },
  palletName: "Utility",
  methodName: "batch_all",
  args: {
    calls: recipients.map(({ publicKey }) => ({
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
  })
  .bind(env);

// TODO: uncomment these lines upon solving `count` in zones
// console.log(U.throwIfError(await getBalances()));
U.throwIfError(await runTx());
// console.log(U.throwIfError(await getBalances()));
