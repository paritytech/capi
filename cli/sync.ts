import { Command, EnumType } from "../deps/cliffy.ts"
import { blue, gray } from "../deps/std/fmt/colors.ts"
import { assertEquals } from "../deps/std/testing/asserts.ts"
import { detectVersion } from "../server/detectVersion.ts"
import { syncNets } from "../server/mod.ts"
import { normalizePackageName } from "../util/mod.ts"
import { tempDir } from "../util/tempDir.ts"
import { resolveNets } from "./resolveNets.ts"

export const sync = new Command()
  .type("runtime", new EnumType(["deno", "node"]))
  .description("Sync net specs and update your manifest")
  .arguments("<runtime:runtime>")
  .option("-n, --nets <nets:file>", "nets.ts file path", { default: "./nets.ts" })
  .option("--check", "ensures that metadata and codegen are in sync")
  .option("-o, --out <out:string>", "Metadata and codegen output directory", {
    default: "target/capi",
  })
  .option("-s, --server <server:string>", "")
  .option(
    "--runtime-config <runtimeConfig:string>",
    "the import_map.json or package.json file path",
  )
  .action(runSync)

export interface RunSyncOptions {
  nets: string
  check?: true
  out: string
  server?: string
  runtimeConfig?: string
}

async function runSync({
  nets: netsFile,
  check,
  out,
  server,
  runtimeConfig,
}: RunSyncOptions, runtime: string) {
  const netSpecs = await resolveNets(netsFile)
  const devnetTempDir = await tempDir(out, "devnet")
  const version = detectVersion()
  if (!server && !version) {
    throw new Error(
      "Could not auto-detect version; please re-run `sync` with \`--server\` specified.",
    )
  }
  const baseUrl = await syncNets(
    server ?? `https://capi.dev/${version}/`,
    devnetTempDir,
    netSpecs,
  )
  if (runtime === "deno") {
    runtimeConfig ??= "import_map.json"
    syncFile(runtimeConfig, (importMap) => {
      importMap.imports["@capi/"] = baseUrl
    })
  } else if (runtime === "node") {
    runtimeConfig ??= "package.json"
    syncFile(runtimeConfig, (packageJson) => {
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
      packageJson.dependencies = Object.keys(packageJson.dependencies).sort().reduce(
        (obj, key) => {
          obj[key] = packageJson.dependencies[key]
          return obj
        },
        {} as Record<string, string>,
      )
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
