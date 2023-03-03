import * as toml from "./deps/std/encoding/toml.ts"
import * as flags from "./deps/std/flags.ts"
import * as path from "./deps/std/path.ts"
import { unreachable } from "./deps/std/testing/asserts.ts"

const ZOMBIENET_BIN_DEFAULTS: Record<string, string> = {
  darwin: "zombienet-macos",
  linux: "zombienet-linux-x64",
}

if (import.meta.main) {
  await main()
}

async function main() {
  const { config, testConfig, snapshotPath } = flags.parse(Deno.args, {
    string: ["config", "testConfig", "snapshotPath"],
  })

  if (!config || !testConfig || !snapshotPath) {
    console.log(
      "usage: main.ts --config config.toml --testConfig testConfig.zndsl --snapshotPath snapshotPath",
    )
    Deno.exit(1)
  }

  const tempDir = await Deno.makeTempDir({ prefix: "zombienet_db_snapshot_" })

  const configPath = path.join(Deno.cwd(), config)
  const configName = path.parse(configPath).name
  const zombienet = await startZombienet(configPath, tempDir)

  const networkManifestPath = path.join(tempDir, "zombie.json")

  const testPath = path.join(Deno.cwd(), testConfig)
  await runCommand(() => runZombienetTest(testPath, networkManifestPath))

  zombienet.kill("SIGINT")

  const zombienetConfig = await parseToml(configPath)

  await Deno.mkdir(snapshotPath, { recursive: true })

  const relaychainDbPath = path.join(tempDir, getFirstValidatorName(zombienetConfig))
  const relaychainDbSnapshot = `${configName}-${path.basename(relaychainDbPath)}-db-snapshot.tgz`
  const relaychainDbSnapshotPath = path.join(snapshotPath, relaychainDbSnapshot)
  await runCommand(() => createDbSnapshot(relaychainDbPath, relaychainDbSnapshotPath))
  console.log("created snapshot", relaychainDbSnapshotPath)

  const parachainDbPath = path.join(tempDir, getFirstCollatorName(zombienetConfig))
  const parachainDbSnapshot = `${configName}-${path.basename(parachainDbPath)}-db-snapshot.tgz`
  const parachainDbSnapshotPath = path.join(snapshotPath, parachainDbSnapshot)
  await runCommand(() => createDbSnapshot(parachainDbPath, parachainDbSnapshotPath))
  console.log("created snapshot", parachainDbSnapshotPath)

  const snapshotConfigPath = path.join(snapshotPath, path.basename(configPath))

  await createZombienetDbSnapshotConfig(
    configPath,
    snapshotConfigPath,
    `http://localhost:4646/${snapshotPath}/${relaychainDbSnapshot}`,
    `http://localhost:4646/${snapshotPath}/${parachainDbSnapshot}`,
  )
  console.log("created zombienet config with snapshots", snapshotConfigPath)
}

async function startZombienet(configPath: string, tempDir: string): Promise<Deno.ChildProcess> {
  const cmd = new Deno.Command(
    ZOMBIENET_BIN_DEFAULTS[Deno.build.os]!,
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
    ZOMBIENET_BIN_DEFAULTS[Deno.build.os]!,
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
  const watcher = Deno.watchFs(zombienetCachePath, { recursive: false })
  for await (const e of watcher) {
    if (e.kind === "modify" && e.paths.some((p) => p.endsWith(networkManifestPath))) {
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
