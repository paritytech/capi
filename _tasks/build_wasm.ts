import { pathJoin } from "../barrel.ts";
import { runCmd } from "../util/runCmd.ts";

const OutDir = (feature: string) => {
  return pathJoin("target", "wasm", feature);
};

const buildWasm = async (feature: string): Promise<void> => {
  await runCmd([
    "cargo",
    "build",
    "--features",
    feature,
    "--release",
    "--target",
    "wasm32-unknown-unknown",
  ]);
  await runCmd([
    "wasm-bindgen",
    pathJoin("target", "wasm32-unknown-unknown", "release", "mod.wasm"),
    "--target",
    "deno",
    "--weak-refs",
    "--out-dir",
    OutDir(feature),
  ]);
};

// TODO: zip & inline! Perform gzip(base64(gzip(wasm))) like @tomaka does in Smoldot.
await buildWasm("crypto");
const outWasmPath = pathJoin(OutDir("crypto"), "mod_bg.wasm");
await runCmd(["wasm-opt", "-g", "-Oz", outWasmPath, "-o", outWasmPath]);
