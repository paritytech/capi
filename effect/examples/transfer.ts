import { createTestPairs } from "../../deps/polkadot/keyring.ts";
import { assert } from "../../deps/std/testing/asserts.ts";
import * as t from "../../test-util/mod.ts";
import * as U from "../../util/mod.ts";
import * as Z from "../mod.ts";

const testPairs = createTestPairs({
  type: "sr25519",
  ss58Format: 0,
});
const { alice, bob } = testPairs;
assert(alice && bob);

await t.ctx(async (config) => {
  const tx = Z.sendAndWatchExtrinsic(
    config,
    {
      type: "Id",
      value: alice.publicKey,
    },
    "Balances",
    "transfer",
    {
      dest: {
        type: "Id",
        value: bob.publicKey,
      },
      value: 12345n,
    },
    (message) => {
      return {
        type: "Sr25519",
        value: alice.sign(message),
      };
    },
    (stop) => {
      return (message) => {
        if (typeof message.params.result === "string") {
          console.log("Extrinsic", message.params.result);
        } else {
          if (message.params.result.inBlock) {
            console.log("Extrinsic in block", message.params.result.inBlock);
          } else if (message.params.result.finalized) {
            console.log("Extrinsic finalized as of", message.params.result.finalized);
            stop();
          } else {
            console.log("Misc", message.params.result);
            stop();
          }
        }
      };
    },
  );
  U.throwIfError(await Z.run(tx));
});
