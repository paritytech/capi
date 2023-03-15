import * as core from "./deps/actions/core.ts"
import * as esbuild from "./deps/esbuild.ts"
import { denoPlugin } from "./deps/esbuild_deno_loader.ts"
import puppeteer from "./deps/puppeteer.ts"
import { makeRunWithLimit } from "./deps/run_with_limit.ts"
import { parse } from "./deps/std/flags.ts"
import { Buffer, readLines } from "./deps/std/io.ts"
import * as path from "./deps/std/path.ts"
import { readerFromStreamReader, writeAll, writeAllSync } from "./deps/std/streams.ts"

const flags = parse(Deno.args, {
  string: ["dir", "concurrency", "ignore", "importMap"],
  boolean: ["browser"],
  default: { ignore: ".ignore" },
})

const { ignore, importMap, browser: useBrowser } = flags
const concurrency = flags.concurrency ? Number.parseInt(flags.concurrency) : undefined
if (!flags.dir) {
  throw new Error("dir flag is required")
}
const dir = flags.dir

const runWithLimit = concurrency
  ? makeRunWithLimit<readonly [string, number]>(concurrency).runWithLimit
  : <T>(fn: () => Promise<T>) => fn()

const ignoreFile = await Deno.readTextFile(path.join(dir, ignore))
const ignoredFiles = new Set(ignoreFile.split("\n"))

const sourceFileNames = Array.from(Deno.readDirSync(dir))
  .filter((e) => e.name.match(/^.*\.ts$/g) && e.isFile && !ignoredFiles.has(e.name))
  .map((f) => f.name)

const result = useBrowser ? await runWithBrowser() : await runWithDeno()
const isFailed = result.find(([_, exitCode]) => exitCode === 1)
core.info("done running examples")

if (Deno.env.get("GITHUB_STEP_SUMMARY")) {
  await core.summary
    .addHeading("Test Results")
    .addTable([
      [{ data: "File", header: true }, { data: "ExitCode", header: true }],
      ...result.map(([name, statusCode]) => [name, `${statusCode}`]),
    ])
    .write({ overwrite: true })
  if (isFailed) {
    core.setFailed("One or more tests failed with exitcode status 1")
    Deno.exit(1)
  }
} else {
  console.log("Test Results", result)
  if (isFailed) {
    Deno.exit(1)
  }
}

function runWithDeno() {
  return Promise.all(sourceFileNames.map((name) =>
    runWithLimit(async () => {
      core.info(`Running example: ${name}`)
      const command = new Deno.Command(Deno.execPath(), {
        args: ["run", "-A", "-r=http://localhost:4646/", `${dir}/${name}`],
        stdout: "piped",
        stderr: "piped",
      })
      const task = command.spawn()
      const out = new Buffer()
      await Promise.all([
        pipeThrough(readerFromStreamReader(task.stdout.getReader()), out),
        pipeThrough(readerFromStreamReader(task.stderr.getReader()), out),
      ])

      const status = await task.status
      if (!status.success) {
        for await (const line of readLines(out)) {
          core.debug(line)
        }
      }

      return [name, status.code] as const
    })
  ))
}
async function runWithBrowser() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const result = await Promise.all(sourceFileNames.map((name) =>
    runWithLimit(async () => {
      const page = await browser.newPage()
      const result = await esbuild.build({
        plugins: [
          denoPlugin({
            importMapURL: importMap
              ? path.toFileUrl(`${Deno.cwd()}/${importMap}`)
              : undefined,
          }),
        ],
        entryPoints: [path.join(dir, name)],
        bundle: true,
        write: false,
        format: "esm",
      })

      const code = executionWrapper(result.outputFiles[0]?.text!)

      const consoleOutput = new Buffer()
      const encoder = new TextEncoder()

      page
        .on(
          "console",
          (message) => writeAllSync(consoleOutput, encoder.encode(`${message.text()}\n`)),
        )

      const exit = new Promise<number>((res) =>
        page.exposeFunction("exit", (args: string) => {
          res(Number.parseInt(args))
        })
      )

      await page.addScriptTag({ content: code, type: "module" })

      return [name, await exit] as const
    })
  ))

  await browser.close()

  return result
}

async function pipeThrough(reader: Deno.Reader, writer: Deno.Writer) {
  const encoder = new TextEncoder()
  for await (const line of readLines(reader)) {
    await writeAll(writer, encoder.encode(`${line}\n`))
  }
}

function executionWrapper(code: string) {
  return `
try {
  ${code}
  exit(0)
} catch (err) {
  console.error(err)
  exit(1)
}`
}
