import { build, EntryPoint } from "../deps/dnt.ts"
import * as flags from "../deps/std/flags.ts"
import * as fs from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"
import importMap from "../import_map.json" assert { type: "json" }
import * as nets from "../nets.ts"
import { normalizePackageName } from "../util/normalize.ts"

const { version: packageVersion, server: serverVersion } = flags.parse(Deno.args, {
  string: ["version", "server"],
  default: {
    version: "v0.0.0-local",
  },
})

const server = serverVersion ? `https://capi.dev/@${serverVersion}/` : "http://localhost:4646/"
const hash = new URL(importMap.imports["@capi/"]).pathname.slice(1, -1)

const outDir = path.join("target", "npm")

await fs.emptyDir(outDir)

const entryPoints: EntryPoint[] = []
const mappings: Record<string, string> = {}

const allFiles = []
for await (
  const { path } of fs.walkSync(".", {
    exts: [".ts"],
    skip: [/\.test\.ts$/, /^\.\/target\//, /\/_/],
    includeDirs: false,
  })
) allFiles.push(`./${path}`)

for (const pathname of allFiles) {
  if (!pathname.endsWith(".node.ts")) {
    entryPoints.push({
      name: pathname.slice(0, -(pathname.endsWith("mod.ts") ? "/mod.ts".length : ".ts".length)),
      path: pathname,
    })
    const nodePath = pathname.slice(0, -".ts".length) + ".node.ts"
    if (allFiles.includes(nodePath)) {
      mappings[pathname] = nodePath
    }
  }
}

await Promise.all([
  build({
    package: {
      name: "capi",
      version: packageVersion,
      type: "module",
      description: "Capi is a framework for crafting interactions with Substrate chains",
      license: "Apache-2.0",
      repository: "github:paritytech/capi",
      dependencies: Object.fromEntries(
        Object.keys(nets).map((key) => {
          const name = normalizePackageName(key)
          return [`@capi/${name}`, `${server}${hash}/${name}.tar`]
        }),
      ),
    },
    compilerOptions: {
      importHelpers: true,
      sourceMap: true,
      target: "ES2021",
      lib: ["es2022.error"],
    },
    entryPoints: [
      {
        kind: "bin",
        name: "capi",
        path: "./main.ts",
      },
      ...entryPoints,
    ],
    mappings: {
      ...mappings,
      "https://deno.land/x/wat_the_crypto@v0.0.1/mod.ts": {
        name: "wat-the-crypto",
        version: "0.0.1",
      },
      "https://deno.land/x/scale@v0.11.2/mod.ts#=": {
        name: "scale-codec",
        version: "0.11.2",
      },
      "https://deno.land/x/smoldot@light-js-deno-v0.7.6/index-deno.js": {
        name: "@substrate/smoldot-light",
        version: "0.7.6",
      },
      "https://deno.land/x/smoldot@light-js-deno-v0.7.6/client.d.ts": {
        name: "@substrate/smoldot-light",
        version: "0.7.6",
      },
      "https://esm.sh/v113/shiki@0.14.1?bundle": {
        name: "shiki",
        version: "0.14.1",
      },
      "./deps/shims/ws.ts": {
        name: "ws",
        version: "8.13.0",
      },
      "./deps/shims/shim-deno.ts": "@deno/shim-deno",
      "node:net": "node:net",
      "node:http": "node:http",
      "node:stream": "node:stream",
    },
    outDir,
    scriptModule: false,
    shims: {
      deno: true,
      crypto: true,
      custom: [{
        package: {
          name: "isomorphic-ws",
          version: "5.0.0",
        },
        globalNames: [{
          name: "WebSocket",
          exportName: "default",
        }],
      }],
    },
    test: false,
    typeCheck: false,
  }),
  fs.copy("LICENSE", path.join(outDir, "LICENSE")),
  fs.copy("Readme.md", path.join(outDir, "Readme.md")),
  fs.copy("server/static/", path.join(outDir, "esm/server/static/")),
])

await Promise.all([
  editFile(
    "target/npm/esm/main.js",
    (content) =>
      content
        .replace(/^#!.+/, "#!/usr/bin/env -S node --loader ts-node/esm"),
  ),
  editFile(
    "target/npm/esm/_dnt.shims.js",
    (content) =>
      content
        .replace(/"@deno\/shim-deno"/g, `"./deps/shims/Deno.node.js"`),
  ),
])

async function editFile(path: string, modify: (content: string) => string) {
  await Deno.writeTextFile(path, modify(await Deno.readTextFile(path)))
}
