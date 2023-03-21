import * as core from "./deps/actions/core.ts"
import puppeteer from "./deps/puppeteer.ts"
import { parse } from "./deps/std/flags.ts"
import * as path from "./deps/std/path.ts"
import { run, runWithBrowser, runWithDeno } from "./run.ts"

const flags = parse(Deno.args, {
  string: ["dir", "concurrency", "ignore", "import-map", "filter"],
  boolean: ["browser"],
  default: { ignore: ".ignore" },
})

const { ignore, dir, browser } = flags
const importMap = flags["import-map"]
const concurrency = flags.concurrency ? parseInt(flags.concurrency) : Infinity
if (!dir) {
  throw new Error("dir flag is required")
}

const filter = flags.filter ? new Set(flags.filter.split(",")) : new Set()

const ignoreFile = await Deno.readTextFile(path.join(dir, ignore))
const ignoredFiles = new Set(ignoreFile.split("\n"))

const sourceFileNames = Array.from(Deno.readDirSync(dir))
  .filter((e) =>
    e.name.match(/^.*\.ts$/g)
    && e.isFile
    && !ignoredFiles.has(e.name)
    && ((filter.size > 0 && filter.has(e.name)) || filter.size === 0)
  )
  .map((f) => f.name)

const controller = new AbortController()
const { signal } = controller

async function shutdown(exitCode: number) {
  console.log(`\nshutting down with exitcode ${exitCode}`)

  self.addEventListener("unload", () => Deno.exit(exitCode))
  controller.abort()
}

Deno.addSignalListener("SIGINT", () => shutdown(1))
Deno.addSignalListener("SIGTERM", () => shutdown(1))

const createBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  signal.addEventListener("abort", async () => {
    await browser.close()
  })

  return browser
}
const importMapUrl = importMap
  ? path.toFileUrl(`${Deno.cwd()}/${importMap}`)
  : undefined

const results: [fileName: string, exitCode: number][] = []
const runner = browser
  ? await runWithBrowser({ createBrowser, importMapUrl, results })
  : await runWithDeno({ reloadUrl: "http://localhost:4646", results })
const paths = sourceFileNames.map((fileName) => [dir, fileName] as const)

await run({ paths, runner, concurrency })
const failedTests = results
  .filter(([_, exitCode]) => exitCode !== 0)
  .map(([fileName, _]) => fileName)
const isFailed = failedTests.length > 0

console.log(`test results -- ${failedTests.length} failure(s)`)
if (isFailed) {
  console.log(failedTests)
}

if (Deno.env.get("GITHUB_STEP_SUMMARY")) {
  await core.summary
    .addHeading("Failures")
    .addTable([
      [{ data: "file", header: true }],
      ...results.filter(([_, exitCode]) => exitCode !== 0).map(([name]) => [name]),
    ])
    .write({ overwrite: true })
}

if (isFailed) {
  core.setFailed("One or more tests failed with exitcode status 1")
  shutdown(1)
} else {
  shutdown(0)
}
