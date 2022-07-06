import { assert } from "../_deps/asserts.ts";
import { compress } from "../_deps/lz4.ts";
import * as path from "../_deps/path.ts";

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
      "https://deno.land/x/wasmbuild@0.8.2/main.ts",
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
  const wasmPath = path.join(destDir, `mod_bg.wasm`);
  const wasmBytes = await Deno.readFile(wasmPath);
  const wasmCompressed = compress(wasmBytes);
  Deno.writeFile(wasmPath, wasmCompressed);
}

await ([
  ["hashers"],
  ["sr25519", "test-util/sr25519"],
  ["ss58"],
] as const).reduce(async (acc, [featureName, destDir]) => {
  await acc;
  await build(featureName, destDir);
}, Promise.resolve());
