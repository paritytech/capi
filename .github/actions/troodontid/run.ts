import * as esbuild from "./deps/esbuild.ts"
import { denoPlugin } from "./deps/esbuild_deno_loader.ts"
import { renderFile } from "./deps/eta.ts"
import { PQueue } from "./deps/pqueue.ts"
import { Browser } from "./deps/puppeteer.ts"
import { deferred } from "./deps/std/async.ts"
import { Buffer, readLines } from "./deps/std/io.ts"
import * as path from "./deps/std/path.ts"
import { readerFromStreamReader, writeAll } from "./deps/std/streams.ts"

export interface Logger {
  info: (...data: any[]) => void
  error: (...data: any[]) => void
}

export interface RunOptions {
  paths: Array<readonly [dir: string, fileName: string]>
  concurrency: number
  runner: (dir: string, fileName: string) => Promise<void>
}

export async function run({ paths, concurrency, runner }: RunOptions) {
  console.log("concurrency", concurrency)
  const runQueue = new PQueue({ concurrency })
  runQueue.addAll(paths.map(([dir, fileName]) => () => runner(dir, fileName)))
  await runQueue.onIdle()
}

export interface RunWithBrowserOptions {
  createBrowser: () => Promise<Browser>
  importMapURL?: URL
  results: [fileName: string, exitCode: number][]
  logger: Logger
}

export async function runWithBrowser(
  { createBrowser, importMapURL, logger, results }: RunWithBrowserOptions,
) {
  const browser = await createBrowser()
  return (async (dir: string, fileName: string) => {
    logger.info(`running ${fileName}`)
    const outputQueue = new PQueue({ concurrency: 1, autoStart: false })

    outputQueue.add(() => console.log(`${fileName} output:`))

    const page = await browser.newPage()
    const result = await esbuild.build({
      plugins: [
        denoPlugin({
          importMapURL,
        }) as any,
      ],
      entryPoints: [path.join(dir, fileName)],
      bundle: true,
      write: false,
      format: "esm",
    })

    const code = await renderFile("./template", { code: result.outputFiles[0]?.text! })

    await page.exposeFunction("log", (...args: unknown[]) => {
      outputQueue.add(() => console.log(args))
    })

    await page.exposeFunction("logError", (...args: unknown[]) => {
      outputQueue.add(() => console.error(args))
    })

    const exit = deferred<number>()
    await page.exposeFunction("exit", (args: string) => {
      exit.resolve(Number.parseInt(args))
    })

    await page.addScriptTag({ content: code, type: "module" })

    const exitCode = await exit

    outputQueue.start()
    await outputQueue.onIdle()

    logger.info(`finished ${fileName}`)

    results.push([fileName, exitCode])
  })
}

export interface RunWithDenoOptions {
  results: [fileName: string, exitCode: number][]
  logger: Logger
  reloadUrl: string
}

export async function runWithDeno({ logger, reloadUrl, results }: RunWithDenoOptions) {
  return (async (dir: string, fileName: string) => {
    logger.info(`running ${fileName}`)
    const command = new Deno.Command(Deno.execPath(), {
      args: ["run", "-A", `-r=${reloadUrl}`, `${dir}/${fileName}`],
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
    for await (const line of readLines(out)) {
      console.log(line)
    }

    logger.info(`finished ${fileName}`)

    results.push([fileName, status.code])
  })
}

async function pipeThrough(reader: Deno.Reader, writer: Deno.Writer) {
  const encoder = new TextEncoder()
  for await (const line of readLines(reader)) {
    await writeAll(writer, encoder.encode(`${line}\n`))
  }
}
