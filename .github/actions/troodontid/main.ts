import * as core from "./deps/actions/core.ts"
import { configure } from "./deps/eta.ts"
import { PQueue } from "./deps/pqueue.ts"
import puppeteer from "./deps/puppeteer.ts"
import { deferred } from "./deps/std/async.ts"
import { parse } from "./deps/std/flags.ts"
import * as path from "./deps/std/path.ts"
import { run, runWithBrowser, runWithDeno } from "./run.ts"

const currentDir = new URL(import.meta.url).pathname.split("/").slice(0, -1).join("/")
const viewPath = `${currentDir}/views/`

configure({
  autoTrim: ["nl", false],
  views: viewPath,
})

const flags = parse(Deno.args, {
  string: ["dir", "concurrency", "ignore", "importMap", "filter"],
  boolean: ["browser"],
  default: { ignore: ".ignore" },
})

const { ignore, importMap, browser: useBrowser } = flags
console.log("flags.concurrency", flags.concurrency)
const concurrency = flags.concurrency ? Number.parseInt(flags.concurrency) : Infinity
if (!flags.dir) {
  throw new Error("dir flag is required")
}
const dir = flags.dir

const filter = flags.filter ? new Set(flags.filter.split(",")) : undefined

const ignoreFile = await Deno.readTextFile(path.join(dir, ignore))
const ignoredFiles = new Set(ignoreFile.split("\n"))

const sourceFileNames = Array.from(Deno.readDirSync(dir))
  .filter((e) => e.name.match(/^.*\.ts$/g) && e.isFile && !ignoredFiles.has(e.name))
  .filter((e) => filter ? filter.has(e.name) : true)
  .map((f) => f.name)

const logger = {
  info: (...args: any[]) => console.log(...args),
  error: (...args: any[]) => console.error(...args),
}

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
const runner = useBrowser
  ? await runWithBrowser({ createBrowser, importMapURL, logger, results })
  : await runWithDeno({ logger, reloadUrl: "http://localhost:4646", results })
const paths = sourceFileNames.map((fileName) => [dir, fileName] as const)

await run({ paths, runner, concurrency })
console.log("test results", results)

const isFailed = results.find(([_, exitCode]) => exitCode === 1)
if (Deno.env.get("GITHUB_STEP_SUMMARY")) {
  await core.summary
    .addHeading("Test Results")
    .addTable([
      [{ data: "File", header: true }, { data: "ExitCode", header: true }],
      ...results.map(([name, exitCode]) => [name, `${exitCode}`]),
    ])
    .write({ overwrite: true })
}

if (isFailed) {
  core.setFailed("One or more tests failed with exitcode status 1")
  shutdown(1)
} else {
  shutdown(0)
}
