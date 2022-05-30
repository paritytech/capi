import { dntBuild } from "../barrel.ts";
import { emptyDir, fsCopy, pathJoin } from "../barrel.ts";

const outDir = pathJoin("target", "npm");

await emptyDir(outDir);

await Promise.all([
  dntBuild({
    importMap: "import_map.json",
    entryPoints: ["./mod.ts", "./crypto/mod.ts"],
    outDir,
    mappings: {
      "https://deno.land/x/scale@v0.1.1/mod.ts": {
        name: "parity-scale-codec",
        version: "^0.1.1",
      },
    },
    package: {
      name: "capi-beta",
      version: "0.1.0-beta.1", // Deno.args[0]!,
      description: "A TypeScript toolkit for crafting interactions with Substrate-based chains",
      license: "Apache-2.0",
      repository: "github:paritytech/capi",
    },
    compilerOptions: {
      importHelpers: true,
      sourceMap: true,
      target: "ES2021",
    },
    scriptModule: false, // re-enable once top-level await removed from wasm bindings
    shims: {
      webSocket: true,
    },
    test: false,
    typeCheck: false,
  }),
  fsCopy("LICENSE", pathJoin(outDir, "LICENSE")),
]);
