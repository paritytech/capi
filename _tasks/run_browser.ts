import * as fs from "https://deno.land/std@0.163.0/fs/mod.ts"
import * as path from "../deps/std/path.ts"

const dirname = path.dirname(path.fromFileUrl(import.meta.url))

const staticDir = path.join(dirname, "../target/static")

const file = Deno.args[0]!

await fs.emptyDir(staticDir)

if (
  !(await Deno.run({ cmd: ["deno", "bundle", file, path.join(staticDir, "index.js")] })
    .status()).success
) {
  throw 0
}

await Deno.writeTextFile(
  path.join(staticDir, "index.html"),
  `
<script>Deno = { _browserShim: true, args: [], build: { arch: "x86_64" }, errors: { PermissionDenied: Error }, env: new Map(${
    JSON.stringify(Object.entries(Deno.env.toObject()))
  }) }</script>
<script type="module" src="index.js"></script>
`.trim(),
)

await Deno.run({
  cmd: ["deno", "run", "-A", "https://deno.land/std@0.159.0/http/file_server.ts", staticDir],
}).status()
