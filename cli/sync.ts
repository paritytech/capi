import { createTempDir } from "../capn/createTempDir.ts"
import { syncConfig } from "../capn/mod.ts"
import * as flags from "../deps/std/flags.ts"
import { resolveConfig } from "./resolveConfig.ts"

export default async function(...args: string[]) {
  const {
    "import-map": importMapFile,
    "package-json": packageJsonFile,
  } = flags.parse(
    args,
    {
      string: ["config", "import-map", "package-json"],
    },
  )

  const config = await resolveConfig(...args)

  const tempDir = await createTempDir()

  const baseUrl = await syncConfig(tempDir, config)
  console.log(baseUrl)

  if (importMapFile) {
    const importMap = JSON.parse(await Deno.readTextFile(importMapFile))
    importMap.imports["@capi/"] = baseUrl
    await Deno.writeTextFile(importMapFile, JSON.stringify(importMap, null, 2) + "\n")
  }

  if (packageJsonFile) {
    throw new Error("not yet supported")
  }
}
