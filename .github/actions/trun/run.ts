import * as esbuild from "./deps/esbuild.ts"
import { denoPlugin } from "./deps/esbuild_deno_loader.ts"
import PQueue from "./deps/pqueue.ts"
import { Browser } from "./deps/puppeteer.ts"
import { deferred } from "./deps/std/async.ts"
import { Buffer, readLines } from "./deps/std/io.ts"
import * as path from "./deps/std/path.ts"
import { readerFromStreamReader, writeAll } from "./deps/std/streams.ts"

export interface RunOptions {
  paths: (readonly [dir: string, fileName: string])[]
  concurrency: number
  runner: (dir: string, fileName: string) => Promise<void>
}

export async function run({ paths, concurrency, runner }: RunOptions) {
  const runQueue = new PQueue({ concurrency })
  runQueue.addAll(paths.map(([dir, fileName]) => () => runner(dir, fileName)))
  await runQueue.onIdle()
}

export interface RunWithBrowserOptions {
  createBrowser: () => Promise<Browser>
  importMapUrl?: URL
  results: [fileName: string, exitCode: number][]
}

export async function runWithBrowser(
  { createBrowser, importMapUrl, results }: RunWithBrowserOptions,
) {
  const browser = await createBrowser()
  const consoleJs = await fetch(import.meta.resolve("./console.js")).then((r) => r.text())

  return (async (dir: string, fileName: string) => {
    console.log(`running ${fileName}`)

    const page = await browser.newPage()
    const result = await esbuild.build({
      plugins: [
        denoPlugin({
          importMapURL: importMapUrl,
        }) as any,
      ],
      entryPoints: [path.join(dir, fileName)],
      bundle: true,
      write: false,
      format: "esm",
    })

    const code = wrapCode(`${consoleJs}\n${result.outputFiles[0]?.text!}`)

    const outputBuffer = new Buffer()

    await page.exposeFunction("__trun_injected_log", (...[msg]: [string, number]) => {
      outputBuffer.writeSync(new TextEncoder().encode(msg))
    })

    const exit = deferred<number>()
    await page.exposeFunction("exit", (args: string) => {
      exit.resolve(Number.parseInt(args))
    })

    await page.addScriptTag({ content: code, type: "module" })

    const exitCode = await exit

    if (exitCode !== 0) {
      console.log(`${fileName} failed -- console output:`)
      console.log(new TextDecoder().decode(outputBuffer.bytes()))
    }

    console.log(`finished ${fileName}`)

    results.push([fileName, exitCode])
  })
}

export interface RunWithDenoOptions {
  results: [fileName: string, exitCode: number][]
  reloadUrl: string
}

export async function runWithDeno({ reloadUrl, results }: RunWithDenoOptions) {
  return (async (dir: string, fileName: string) => {
    console.log(`running ${fileName}`)
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
    if (!status.success) {
      for await (const line of readLines(out)) {
        console.log(line)
      }
    }

    console.log(`finished ${fileName}`)

    results.push([fileName, status.code])
  })
}

async function pipeThrough(reader: Deno.Reader, writer: Deno.Writer) {
  const encoder = new TextEncoder()
  for await (const line of readLines(reader)) {
    await writeAll(writer, encoder.encode(`${line}\n`))
  }
}

const wrapCode = (code: string) => `
try {
  ${code}
  exit(0)
} catch (err) {
  console.error(err)
  exit(1)
}
`
