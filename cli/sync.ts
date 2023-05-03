import { Command } from "../deps/cliffy.ts"
import { blue, gray } from "../deps/std/fmt/colors.ts"
import { assertEquals } from "../deps/std/testing/asserts.ts"
import { syncNets } from "../server/mod.ts"
import { normalizePackageName } from "../util/mod.ts"
import { tempDir } from "../util/tempDir.ts"
import { resolveNets } from "./resolveNets.ts"

export default new Command()
  .description("Syncs metadata and codegen")
  .option("-n, --nets <nets:file>", "nets.ts file path", { default: "./nets.ts" })
  .option("--import-map <import-map:file>", "import_map.json file path")
  .option("--package-json <package-json:file>", "package.json file path")
  .option("--check", "ensures that metadata and codegen are in sync")
  .option("-o, --out <out:string>", "Metadata and codegen output directory", {
    default: "target/capi",
  })
  .option("-s, --server <server:string>", "", { default: "https://capi.dev/" })
  .action(
    async function(
      {
        nets: netsFile,
        importMap: importMapFile,
        packageJson: packageJsonFile,
        check,
        out,
        server,
      },
    ) {
      const netSpecs = await resolveNets(netsFile)
      const devnetTempDir = await tempDir(out, "devnet")
      const baseUrl = await syncNets(server, devnetTempDir, netSpecs)
      if (importMapFile) {
        syncFile(importMapFile, (importMap) => {
          importMap.imports["@capi/"] = baseUrl
        })
      }
      if (packageJsonFile) {
        syncFile(packageJsonFile, (packageJson) => {
          const addedPackages = new Set()
          for (const rawName of Object.keys(netSpecs ?? {})) {
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
    },
  )
