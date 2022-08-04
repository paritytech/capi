import { assert } from "../deps/std/testing/asserts.ts";

async function build(featureName: string) {
  const buildProcess = Deno.run({
    cmd: [
      "deno",
      "task",
      "run",
      "https://deno.land/x/wasmbuild@0.8.5/main.ts",
      "--out",
      featureName,
      "--features",
      featureName,
    ],
  });
  const status = await buildProcess.status();
  assert(status.success);
}

await (["hashers", "ss58"] as const).reduce(async (acc, featureName) => {
  await acc;
  await build(featureName);
}, Promise.resolve());
