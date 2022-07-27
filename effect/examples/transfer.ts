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
        console.log(message);
        if (typeof message !== "string" && (message.params.result as any).finalized) {
          stop();
        }
      };
    },
  );
  U.throwIfError(await Z.run(tx));
});
