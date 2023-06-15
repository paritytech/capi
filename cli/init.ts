import { Command } from "../deps/cliffy.ts"
import * as fs from "../deps/std/fs.ts"
import { parse } from "../deps/std/jsonc.ts"
import { detectVersion } from "../server/detectVersion.ts"

export const init = new Command()
  .description("Configure Capi in the current working directory")
  .stopEarly()
  .example("Configure Capi in the current directory", "capi init")
  .action(runInit)

async function runInit() {
  for (
    const [file, runInit] of [
      ["package.json", runInitNode],
      ["deno.json", runInitDeno],
      ["deno.jsonc", runInitDeno],
    ] as const
  ) {
    if (await fs.exists(file)) {
      return await runInit(file)
    }
  }
  throw new Error("Could not find neither a `package.json` nor `deno.json`/`deno.jsonc`.")
}

async function runInitNode(packageJsonPath: string) {
  const packageJson = JSON.parse(await Deno.readTextFile(packageJsonPath))
  if (!packageJson.type || packageJson.type !== "module") {
    throw new Error(
      "Cannot use Capi in a non-esm project. Set `package.json`'s `type` field to `\"module\"`",
    )
  }
  assertManifest(packageJson)
  const dependencies = packageJson.dependencies ??= {}
  dependencies.capi = detectVersion() ?? "*"
  const scripts = packageJson.scripts ??= {}
  scripts["capi:sync"] = "capi sync node"
  scripts["capi:serve"] = "capi serve"
  Deno.writeTextFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  await Promise.all([netsInit("capi/nets"), updateGitignore()])
}

async function runInitDeno(denoJsonPath: string) {
  const denoJson = parse(Deno.readTextFileSync(denoJsonPath))
  assertManifest(denoJson)
  const tasks = denoJson.tasks ??= {}
  const version = detectVersion()
  const versioned = `http://deno.land/x/capi${version ? `@${version}` : ""}`
  tasks["capi"] = `deno run -A ${versioned}/main.ts`
  tasks["capi:sync"] = "deno task capi sync node"
  tasks["capi:serve"] = "deno task capi serve"
  Deno.writeTextFileSync(denoJsonPath, JSON.stringify(denoJson, null, 2))
  await Promise.all([netsInit(`${versioned}/nets/mod.ts`), updateGitignore()])
}

async function netsInit(specifier: string) {
  const code = `import { bins, net } from "${specifier}"

const bin = bins({
  polkadot: ["polkadot-fast", "v0.9.38"],
})

export const polkadotDev = net.dev({
  bin: bin.polkadot,
  chain: "polkadot-dev",
})

export const polkadot = net.ws({
  url: "wss://rpc.polkadot.io/",
  targets: { dev: polkadotDev },
})
`
  const netsExtension = await fs.exists("tsconfig.json") ? "ts" : "js"
  await Deno.writeTextFile(`nets.${netsExtension}`, code)
}

const rTarget = /^target$/gm

async function updateGitignore() {
  try {
    const contents = await Deno.readTextFile(".gitignore")
    if (!rTarget.test(contents)) {
      await Deno.writeTextFile(".gitignore", contents + "\ntarget")
    }
  } catch (_e) {
    await Deno.writeTextFile(".gitignore", "target\n")
  }
}

function assertManifest(
  inQuestion: unknown,
): asserts inQuestion is Record<string, Record<string, string>> {
  if (typeof inQuestion !== "object" || inQuestion === null) {
    throw new Error("Malformed manifest.")
  }
}
