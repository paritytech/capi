import { serveDir } from "https://deno.land/std@0.172.0/http/file_server.ts"
import { serve } from "https://deno.land/std@0.172.0/http/server.ts"
// PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@16.2.0/install.ts
import puppeteer, { Page } from "https://deno.land/x/puppeteer@16.2.0/mod.ts"

import * as path from "../deps/std/path.ts"

// ------- Constants -------

const DIR_NAME = path.dirname(path.fromFileUrl(import.meta.url))
const STATIC_DIR = path.join(DIR_NAME, "../target/static")
const PORT = +(Deno.env.get("PORT") ?? "8000")
const TEST_PATH = Deno.args[0]!
const TEST_NAME = pathToName(TEST_PATH)
const ac = new AbortController()

// ------- Run -------

// TODO:
// [✓] - deno task test:browser examples/derived.ts # one example
// [ ] - deno task test:browser examples/derived.ts examples/derived.ts # two examples, parallel
// [ ] - deno task test:browser # all examples, parallel

await runGenerateTests()
startServer()
const { testError } = await runBrowserTests()
ac.abort()

// CI
if (testError) throw testError

// ------- Generate -------

async function runGenerateTests() {
  await Deno.mkdir(STATIC_DIR, { recursive: true })
  await Promise.all([bundleTestJs(), generateTestHtml()])
}

async function bundleTestJs() {
  if (
    !(await Deno.run({ cmd: ["deno", "bundle", TEST_PATH, `${STATIC_DIR}/${TEST_NAME}.js`] })
      .status()).success
  ) {
    throw 0
  }
}

async function generateTestHtml() {
  await Deno.writeTextFile(
    `${STATIC_DIR}/${TEST_NAME}.html`,
    `<script type="module" src="${TEST_NAME}.js"></script>
    `.trim(),
  )
}

// ------- Server -------

function startServer() {
  serve(function handler(req: Request): Promise<Response> {
    return serveDir(req, { fsRoot: STATIC_DIR })
  }, { port: PORT, signal: ac.signal })
}

// ------- Browser -------

async function runBrowserTests() {
  const browser = await puppeteer.launch()
  const testCase = await browser.newPage()

  await testCase.goto(`http://localhost:${PORT}/${TEST_NAME}.html`)

  let testError = null
  try {
    await checkTest(testCase)
  } catch (err) {
    testError = err
  }

  await browser.close()

  return { testError }
}

function checkTest(testPage: Page) {
  return new Promise((resolve, reject) => {
    testPage.on("pageerror", function(err: Error) {
      console.error(`test "${TEST_NAME}" ... FAILED`)
      reject(err)
    })

    testPage.on("console", (msg: any) => {
      if (msg.type() === "log") console.log(`test "${TEST_NAME}" ... ok`)
      resolve("ok")
    })
  })
}

// ------- Utils -------

function pathToName(path: string) {
  return path.split("/").at(-1)?.split(".")[0]
}
