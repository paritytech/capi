import * as toml from "./deps/std/encoding/toml.ts"
import * as path from "./deps/std/path.ts"
import { unreachable } from "./deps/std/testing/asserts.ts"

if (import.meta.main) {
  await main()
}

async function main() {
  const tempDir = await Deno.makeTempDir({ prefix: "zombienet_db_snapshot_" })

  const configPath = path.join(Deno.cwd(), "zombienets/statemine.toml")
  const zombienet = await startZombienet(configPath, tempDir)

  const networkManifestPath = path.join(tempDir, "zombie.json")

  const testPath = path.join(Deno.cwd(), "zombienets/statemine.zndsl")
  await runCommand(() => runZombienetTest(testPath, networkManifestPath))

  zombienet.kill("SIGINT")

  const zombienetConfig = await parseToml(configPath)

  const relaychainDbPath = path.join(tempDir, getFirstValidatorName(zombienetConfig))
  const relaychainDbSnapshot = `db-snapshot-${path.basename(relaychainDbPath)}.tgz`
  const relaychainDbSnapshotPath = path.join(tempDir, relaychainDbSnapshot)
  await runCommand(() => createDbSnapshot(relaychainDbPath, relaychainDbSnapshotPath))

  const parachainDbPath = path.join(tempDir, getFirstCollatorName(zombienetConfig))
  const parachainDbSnapshot = `db-snapshot-${path.basename(parachainDbPath)}.tgz`
  const parachainDbSnapshotPath = path.join(tempDir, parachainDbSnapshot)
  await runCommand(() => createDbSnapshot(parachainDbPath, parachainDbSnapshotPath))

  const snapshotConfigPath = path.join(tempDir, `${path.basename(configPath)}-snapshot.toml`)

  await createZombienetDbSnapshotConfig(
    configPath,
    snapshotConfigPath,
    `http://localhost:8081/${relaychainDbSnapshot}`,
    `http://localhost:8081/${parachainDbSnapshot}`,
  )
}

async function startZombienet(configPath: string, tempDir: string): Promise<Deno.ChildProcess> {
  const cmd = new Deno.Command(
    "zombienet-macos",
    {
      args: ["-p", "native", "-d", tempDir, "-f", "spawn", configPath],
      stdout: "null",
      stderr: "null",
    },
  )
  const child = cmd.spawn()
  await waitForNetworkManifest(tempDir, path.join(tempDir, "zombie.json"))
  return child
}

function runZombienetTest(
  testPath: string,
  runningNetworkSpec: string,
) {
  return new Deno.Command(
    "zombienet-macos",
    {
      args: ["-p", "native", "test", testPath, runningNetworkSpec],
    },
  )
}

function createDbSnapshot(
  dbPath: string,
  dbSnapshotPath: string,
) {
  return new Deno.Command(
    "tar",
    {
      args: ["-C", dbPath, "-czf", dbSnapshotPath, "data"],
    },
  )
}

async function parseToml(configPath: string): Promise<any> {
  const data = await Deno.readFile(configPath)
  return toml.parse(new TextDecoder().decode(data))
}

async function createZombienetDbSnapshotConfig(
  baseConfigPath: string,
  dbSnapshotConfigPath: string,
  relaychainDbSnapshotUrl: string,
  parachainDbSnapshotUrl: string,
): Promise<void> {
  const config = await parseToml(baseConfigPath)
  config.relaychain["default_db_snapshot"] = relaychainDbSnapshotUrl
  // TODO: support multiple parachain snapshots
  config.parachains[0].collator["db_snapshot"] = parachainDbSnapshotUrl
  await Deno.writeFile(dbSnapshotConfigPath, new TextEncoder().encode(toml.stringify(config)))
}

async function waitForNetworkManifest(
  zombienetCachePath: string,
  networkManifestPath: string,
): Promise<void> {
  const watcher = Deno.watchFs(zombienetCachePath)
  for await (const e of watcher) {
    if (e.kind === "modify" && e.paths.includes(networkManifestPath)) {
      return
    }
  }
  return unreachable()
}

async function runCommand(factory: () => Deno.Command): Promise<void> {
  const output = await factory().output()
  if (output.code !== 0) {
    console.log({ output })
    Deno.exit(1)
  }
}

function getFirstValidatorName(zombienetConfig: any): string {
  return zombienetConfig.relaychain.nodes[0].name
}

function getFirstCollatorName(zombienetConfig: any): string {
  return zombienetConfig.parachains[0].collator.name
}
