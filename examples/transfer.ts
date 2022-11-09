import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const root = C.extrinsic({
  client: T.westend,
  sender: C.MultiAddress.fromKeypair(T.alice),
  palletName: "Balances",
  methodName: "transfer",
  args: {
    value: 12345n,
    dest: C.MultiAddress.fromKeypair(T.bob),
  },
})
  .signed(C.Signer.fromKeypair(T.alice))
  .watch(function(status) {
    console.log(status);
    if (C.TransactionStatus.isTerminal(status)) {
      this.stop();
    }
  });

U.throwIfError(await root.run());
