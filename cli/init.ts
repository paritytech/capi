import { Command } from "../deps/cliffy.ts"
import * as fs from "../deps/std/fs.ts"
import { parse } from "../deps/std/jsonc.ts"
import * as path from "../deps/std/path.ts"
import { detectVersion } from "../server/detectVersion.ts"

export const init = new Command()
  .description("Configure Capi in the current working directory")
  .stopEarly()
  .example("Configure Capi in the current directory", "capi init")
  .action(runInit)

async function runInit() {
  const packageJsonPath = path.join(Deno.cwd(), "package.json")
  if (await fs.exists(packageJsonPath)) return await runInitNode(packageJsonPath)
  let denoJsonPath = path.join(Deno.cwd(), "deno.json")
  if (await fs.exists(denoJsonPath)) return await runInitDeno(denoJsonPath)
  denoJsonPath += "c"
  if (await fs.exists(denoJsonPath)) return await runInitDeno(denoJsonPath)
  throw new Error("Could not find neither a `package.json` nor `deno.json`/`deno.jsonc`.")
}

async function runInitNode(packageJsonPath: string) {
  const packageJson = JSON.parse(await Deno.readTextFile(packageJsonPath))
  assertManifest(packageJson)
  const isTs = confirm("Are you using TypeScript?")
  const devDependencies = packageJson.devDependencies ??= {}
  if (isTs && !devDependencies["ts-node"]) {
    const addTsNode = confirm(
      `To define your net specs in TypeScript, we'll need to install the \`ts-node\` loader. Can we add it to your \`package.json\`?`,
    )
    if (addTsNode) {
      devDependencies["ts-node"] = "*"
    }
  }
  const dependencies = packageJson.dependencies ??= {}
  dependencies.capi = detectVersion() ?? "*"
  const scripts = packageJson.scripts ??= {}
  scripts["capi:sync"] = "capi sync node"
  scripts["capi:serve"] = "capi serve"
  Deno.writeTextFileSync(packageJsonPath, JSON.stringify(packageJsonPath, null, 2))
  await Promise.all([netsInit("capi", isTs), updateGitignore()])
}

async function runInitDeno(denoJsonPath: string) {
  const denoJson = parse(Deno.readTextFileSync(denoJsonPath))
  assertManifest(denoJson)
  const tasks = denoJson.tasks ??= {}
  const version = detectVersion()
  const versioned = `http://deno.land/x/capi${version ? `@${version}` : ""}/main.ts`
  tasks["capi"] = `deno run -A ${versioned}`
  tasks["capi:sync"] = "deno task capi sync node"
  tasks["capi:serve"] = "deno task capi serve"
  Deno.writeTextFileSync(denoJsonPath, JSON.stringify(denoJson, null, 2))
  await Promise.all([netsInit(versioned, true), updateGitignore()])
}

async function netsInit(specifier: string, isTs: boolean) {
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
  await Deno.writeTextFile("nets." + (isTs ? "ts" : "js"), code)
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