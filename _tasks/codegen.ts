import { codegen } from "../codegen/mod.ts"
import * as path from "../deps/std/path.ts"
import * as C from "../mod.ts"
import * as testClients from "../test_util/clients/mod.ts"
import * as U from "../util/mod.ts"

const currentDir = path.dirname(path.fromFileUrl(import.meta.url))
const codegenDir = path.join(currentDir, "../codegen/_output")

await Deno.remove(codegenDir, { recursive: true })

await Promise.all(
  Object.entries(testClients).map(async ([runtime, client]) => {
    // if (runtime !== "polkadot") return;
    const metadata = U.throwIfError(await C.metadata(client)().run())
    const outDir = path.join(codegenDir, runtime)
    await codegen({
      importSpecifier: "../../../mod.ts",
      clientFile: `../../../test_util/clients/${runtime}.ts`,
      metadata,
    }).write(outDir)
  }),
)
