import { runCmd } from "/_/util/runCmd.ts";
import * as path from "std/path/mod.ts";

const OutDir = (feature: string) => {
  return path.join("target", "wasm", feature);
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
    path.join("target", "wasm32-unknown-unknown", "release", "mod.wasm"),
    "--target",
    "deno",
    "--weak-refs",
    "--out-dir",
    OutDir(feature),
  ]);
};

// TODO: zip & inline! Perform gzip(base64(gzip(wasm))) like @tomaka does in Smoldot.
buildWasm("scale_fixtures");
buildWasm("frame_metadata_fixtures");
buildWasm("crypto").then(() => {
  const outWasmPath = path.join(OutDir("crypto"), "mod_bg.wasm");
  return runCmd(["wasm-opt", "-g", "-Oz", outWasmPath, "-o", outWasmPath]);
});
