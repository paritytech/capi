import * as core from "./deps/actions/core.ts"
import PQueue from "./deps/pqueue.ts"
import puppeteer from "./deps/puppeteer.ts"
import { deferred } from "./deps/std/async.ts"
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

const shutdownTasks = new PQueue()
async function shutdown(exitCode: number) {
  console.log(`\nshutting down with exitcode ${exitCode}`)
  browserCloseSignal.resolve()
  await shutdownTasks.onIdle()
  Deno.exit(exitCode)
}

Deno.addSignalListener("SIGINT", () => shutdown(1))

const browserCloseSignal = deferred<void>()
const createBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })
  shutdownTasks.add(async () => {
    await browserCloseSignal
    await browser.close()
  })

  return browser
}
const importMapURL = importMap
  ? path.toFileUrl(`${Deno.cwd()}/${importMap}`)
  : undefined

const results: [fileName: string, exitCode: number][] = []
const runner = browser
  ? await runWithBrowser({ createBrowser, importMapURL, results })
  : await runWithDeno({ reloadUrl: "http://localhost:4646", results })
const paths = sourceFileNames.map((fileName) => [dir, fileName] as const)

await run({ paths, runner, concurrency })
console.log("test results", results)

const isFailed = results.find(([_, exitCode]) => exitCode === 1)
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
