import { Command } from "../deps/cliffy.ts"
import { blue, gray } from "../deps/std/fmt/colors.ts"
import { assertEquals } from "../deps/std/testing/asserts.ts"
import { detectVersion } from "../server/detectVersion.ts"
import { syncNets } from "../server/mod.ts"
import { normalizePackageName } from "../util/mod.ts"
import { tempDir } from "../util/tempDir.ts"
import { resolveNets } from "./resolveNets.ts"

const descriptionLeading = "Sync net specs and update your "

const syncNode = withCommonOptions(new Command()
  .description(`${descriptionLeading} \`package.json\``))
  .action(runSyncNode)

const syncDeno = withCommonOptions(new Command()
  .description(`${descriptionLeading} import map`))
  .option("--import-map <import-map:string>", "the import map path", {
    default: "import_map.json",
  })
  .action(runSyncDeno)

export const sync = new Command()
  .description("Sync net specs and update your manifest")
  .action(function() {
    this.showHelp()
  })
  .command("node", syncNode)
  .command("deno", syncDeno)

function withCommonOptions(command: Command) {
  return command
    .option("-n, --nets <nets:file>", "Path to net-spec-containing file")
    .option("--check", "ensures that metadata and codegen are in sync", { default: false })
    .option("-o, --out <out:string>", "Metadata and codegen output directory", {
      default: "target/capi",
    })
    .option("-s, --server <server:string>", "")
}

interface SyncProps {
  nets?: string
  check: boolean
  out: string
  server?: string
}
async function runSyncNode(props: SyncProps) {
  const { netSpecs, baseUrl } = await setup(props)
  syncFile("package.json", (packageJson) => {
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
    packageJson.dependencies = Object.fromEntries(Object.entries(packageJson.dependencies).sort())
  }, props.check)
}

interface RunSyncDenoProps extends SyncProps {
  importMap: string
}
async function runSyncDeno(props: RunSyncDenoProps) {
  const { baseUrl } = await setup(props)
  syncFile(props.importMap, (importMap) => {
    importMap.imports["@capi/"] = baseUrl
  }, props.check)
}

async function setup(props: SyncProps) {
  const netSpecs = await resolveNets(props.nets)
  const devnetTempDir = await tempDir(props.out, "devnet")
  const version = detectVersion()
  if (!props.server && !version) {
    throw new Error(
      "Could not auto-detect version; please re-run `sync` with \`--server\` specified.",
    )
  }
  const baseUrl = await syncNets(
    props.server ?? `https://capi.dev/@${version}/`,
    devnetTempDir,
    netSpecs,
  )
  return { netSpecs, baseUrl }
}

async function syncFile(filePath: string, modify: (value: any) => void, check: boolean) {
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
