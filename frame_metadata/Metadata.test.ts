import { assertSnapshot } from "../deps/std/testing/snapshot.ts";
import { setup } from "./test-common.ts";

for (
  const name of [
    "polkadot",
    "kusama",
    "statemint",
    "moonbeam",
    "acala",
    "subsocial",
    "westend",
  ] as const
) {
  Deno.test(name, async (t) => {
    const [metadata] = await setup(name);
    await assertSnapshot(t, metadata);
  });
}
