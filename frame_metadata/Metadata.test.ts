import { assertSnapshot } from "../deps/std/testing/snapshot.ts";
import { setup } from "./test-common.ts";

([
  "polkadot",
  "kusama",
  "statemint",
  "moonbeam",
  "acala",
  "subsocial",
  "westend",
] as const).forEach(async (name) => {
  const [metadata] = await setup(name);
  Deno.test(name, async (t) => {
    await assertSnapshot(t, metadata);
  });
});
