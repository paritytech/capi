import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

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
  sender: C.MultiAddress.fromKeypair(T.alice),
  palletName: "Utility",
  methodName: "batch_all",
  args: {
    calls: T.users.map((pair) => ({
      type: "Balances",
      value: {
        type: "transfer",
        dest: C.MultiAddress.fromKeypair(pair),
        value: 12345n,
      },
    })),
  },
})
  .signed(C.Signer.fromKeypair(T.alice))
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

console.log();
