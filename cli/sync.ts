import * as flags from "../deps/std/flags.ts"
import { blue, gray } from "../deps/std/fmt/colors.ts"
import { assertEquals } from "../deps/std/testing/asserts.ts"
import { createTempDir } from "../devnets/createTempDir.ts"
import { syncConfig } from "../devnets/mod.ts"
import { normalizePackageName } from "../util/mod.ts"
import { resolveConfig } from "./resolveConfig.ts"

export default async function(...args: string[]) {
  const {
    "import-map": importMapFile,
    "package-json": packageJsonFile,
    check,
    server,
  } = flags.parse(args, {
    string: ["config", "import-map", "package-json", "server"],
    boolean: ["check"],
    default: { server: "https://capi.dev/" },
  })

  const config = await resolveConfig(...args)

  const tempDir = await createTempDir()

  const baseUrl = await syncConfig(tempDir, config, server)

  if (importMapFile) {
    syncFile(importMapFile, (importMap) => {
      importMap.imports["@capi/"] = baseUrl
    })
  }

  if (packageJsonFile) {
    syncFile(packageJsonFile, (packageJson) => {
      const addedPackages = new Set()
      for (const rawName of Object.keys(config.chains ?? {})) {
        const name = normalizePackageName(rawName)
        const packageName = `@capi/${name}`
        addedPackages.add(packageName)
        packageJson.dependencies[packageName] = `${baseUrl}${name}.tar`
      }
      for (const packageName of Object.keys(packageJson.dependencies)) {
        if (packageName.startsWith("@capi/") && !addedPackages.has(packageName)) {
          delete packageJson.dependencies[packageName]
        }
      }
    })
  }

  async function syncFile(filePath: string, modify: (value: any) => void) {
    const text = await Deno.readTextFile(filePath)
    const newJson = JSON.parse(text)
    modify(newJson)
    try {
      assertEquals(JSON.parse(text), newJson)
      console.log(gray("Unchanged"), filePath)
    } catch (e) {
      if (check) throw e
      await Deno.writeTextFile(filePath, JSON.stringify(newJson, null, 2) + "\n")
      console.log(blue("Updated"), filePath)
    }
  }
}
