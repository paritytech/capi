import { assertSnapshot } from "../_deps/snapshot.ts";
import { Metadata } from "./test-common.ts";

await Promise.all(
  ([
    "polkadot",
    "kusama",
    "statemint",
    "moonbeam",
    "acala",
    "subsocial",
    "westend",
  ] as const).map(async (name) => {
    Deno.test(name, async (t) => {
      await assertSnapshot(t, await Metadata(name));
    });
  }),
);
