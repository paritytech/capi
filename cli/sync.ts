import { processConfig } from "../capn/processConfig.ts"
import * as flags from "../deps/std/flags.ts"
import * as path from "../deps/std/path.ts"

export default async function(...args: string[]) {
  const { config: configFile, "import-map": importMapFile, "package-json": packageJsonFile } = flags
    .parse(
      args,
      {
        string: ["config", "import-map", "package-json"],
        default: {
          config: "./capi.config.ts",
        },
      },
    )
  const configPath = path.resolve(configFile)
  await Deno.stat(configPath)
  const configModule = await import(path.toFileUrl(configPath).toString())
  const config = configModule.config
  if (typeof config !== "object") throw new Error("config file must have a config export")

  const baseUrl = await processConfig(config)
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
