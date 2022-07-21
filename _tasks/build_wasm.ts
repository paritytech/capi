import { assert } from "../_deps/std/testing/asserts.ts";

async function build(
  featureName: string,
  destDir?: string,
) {
  destDir = destDir || featureName;
  const buildProcess = Deno.run({
    cmd: [
      "deno",
      "task",
      "run",
      "https://deno.land/x/wasmbuild@0.8.4/main.ts",
      "--js-ext",
      "mjs",
      "--out",
      destDir,
      "--features",
      featureName,
    ],
  });
  const status = await buildProcess.status();
  assert(status.success);
}

await ([
  ["hashers"],
  ["sr25519", "test-util/sr25519"],
  ["ss58"],
] as const).reduce(async (acc, [featureName, destDir]) => {
  await acc;
  await build(featureName, destDir);
}, Promise.resolve());
