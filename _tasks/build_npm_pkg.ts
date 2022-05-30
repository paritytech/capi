import * as fs from "std/fs/mod.ts";
import * as path from "std/path/mod.ts";
import { build } from "x/dnt/mod.ts";

const outDir = path.join("target", "npm");

await fs.emptyDir(outDir);

await Promise.all([
  build({
    importMap: "import_map.json",
    entryPoints: ["./mod.ts", "./target/wasm/bindings/mod.js"],
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
  fs.copy("LICENSE", path.join(outDir, "LICENSE")),
]);

const importMap: Record<string, string> = JSON.parse(Deno.readTextFileSync("./import_map.json")).imports;
delete importMap["./"];
delete importMap["/"];

function resolve(from: string, to: string) {
  if (to.startsWith("/")) {
    return "./" + path.relative(path.dirname("/" + from), to);
  }
  for (const frag in importMap) {
    if (to.startsWith(frag)) {
      return importMap[frag] + to.slice(frag.length);
    }
  }
  return to;
}

const importRegex = /(from\s*|import\s*)(["'])(.+?)\2/g;

function fixImports(from: string, file: string) {
  return file.replace(importRegex, (_, lead, quote, path) => {
    const newPath = resolve(from, path);
    console.log(from, path, newPath);
    return lead + quote + newPath + quote;
  });
}

for await (
  const { path: file } of fs.walk(".", {
    match: [/^(?!.*\/(target|\.git|_tasks)\/).*\.[tj]s$/],
    includeDirs: false,
  })
) {
  const out = path.join(outDir, "deno", file);
  Deno.mkdirSync(path.dirname(out), { recursive: true });
  Deno.writeTextFileSync(out, fixImports(file, Deno.readTextFileSync(file)));
}
