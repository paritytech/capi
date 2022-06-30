import { assert, fail } from "../_deps/asserts.ts";
import { compress } from "../_deps/lz4.ts";
import * as path from "../_deps/path.ts";

await ["hashers", "sr25519", "ss58"].reduce(async (acc, cur) => {
  await acc;
  const destDir = path.join("bindings", cur);
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
      cur,
    ],
  });
  const status = await buildProcess.status();
  assert(status.success);
  const wasmPath = path.join(destDir, `mod_bg.wasm`);
  const wasmBytes = await Deno.readFile(wasmPath);
  const wasmCompressed = compress(wasmBytes);
  Deno.writeFile(wasmPath, wasmCompressed);
}, Promise.resolve());
