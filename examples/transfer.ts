import { Hash } from "../known/rpc/mod.ts";
import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

let hash: undefined | Hash;

const env = C.Z.env();

const tx = C.extrinsic(T.westend)({
  sender: C.compat.multiAddressFromKeypair(T.alice),
  palletName: "Balances",
  methodName: "transfer",
  args: {
    value: 12345n,
    dest: C.compat.multiAddressFromKeypair(T.bob),
  },
})
  .signed(C.compat.signerFromKeypair(T.alice));

const runTx = tx
  .watch(function(status) {
    console.log(status);
    if (C.TransactionStatus.isTerminal(status)) {
      hash = (status as { finalized: Hash }).finalized;
      this.stop();
    }
  })
  .bind(env);

const readEvents = C
  .events(tx, C.Z.call(() => hash))
  .bind(env);

U.throwIfError(await runTx());
console.log(U.throwIfError(await readEvents()));
