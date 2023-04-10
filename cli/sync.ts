import * as flags from "../deps/std/flags.ts"
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
  } = flags.parse(args, {
    string: ["config", "import-map", "package-json"],
    boolean: ["check"],
  })

  const config = await resolveConfig(...args)

  const tempDir = await createTempDir()

  const baseUrl = await syncConfig(tempDir, config)
  console.log(baseUrl)

  if (importMapFile) {
    const importMapText = await Deno.readTextFile(importMapFile)
    const importMap = JSON.parse(importMapText)
    importMap.imports["@capi/"] = baseUrl
    if (check) {
      assertEquals(JSON.parse(importMapText), importMap)
    } else {
      await Deno.writeTextFile(importMapFile, JSON.stringify(importMap, null, 2) + "\n")
    }
  }

  if (packageJsonFile) {
    const packageJsonText = await Deno.readTextFile(packageJsonFile)
    const packageJson = JSON.parse(packageJsonText)
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
    if (check) {
      assertEquals(JSON.parse(packageJsonText), packageJson)
    } else {
      await Deno.writeTextFile(packageJsonFile, JSON.stringify(packageJson, null, 2) + "\n")
    }
  }
}
