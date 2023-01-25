import { serveDir } from "https://deno.land/std@0.172.0/http/file_server.ts"
import { serve } from "https://deno.land/std@0.172.0/http/server.ts"
// PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@16.2.0/install.ts
import puppeteer, { Page } from "https://deno.land/x/puppeteer@16.2.0/mod.ts"

import * as path from "../deps/std/path.ts"

// ------- Constants -------
const DIR_NAME = path.dirname(path.fromFileUrl(import.meta.url))
const STATIC_DIR = path.join(DIR_NAME, "../target/static")
const TESTS_DIR = "examples"
const PORT = +(Deno.env.get("PORT") ?? "8000")
const ac = new AbortController()

// ------- Main -------
startServer()
const testResults = await runTests([...Deno.args])
ac.abort()
if (hasFailedTest(testResults)) throw new Error("Browser tests FAILED.")

// ------- Server -------
function startServer() {
  serve(function handler(req: Request): Promise<Response> {
    return serveDir(req, { fsRoot: STATIC_DIR })
  }, { port: PORT, signal: ac.signal })
}

// ------- Run -------
async function runTests(tests: string[]) {
  // Run all tests
  if (tests.length === 0) {
    for await (const { isFile, name } of Deno.readDir(TESTS_DIR)) {
      if (!isFile || !hasTsExtension(name) || name === "mod.ts") continue
      tests.push(`${TESTS_DIR}/${name}`)
    }
  }

  const processTests = tests.map(async (testPath) => {
    await runGenerateTests(testPath)
    const { isError } = await runBrowserTests(testPath)
    return isError
  })

  return await Promise.all(processTests)
}

// ------- Generate -------
async function runGenerateTests(testPath: string) {
  await Deno.mkdir(STATIC_DIR, { recursive: true })
  await Promise.all([bundleTestJs(testPath), generateTestHtml(testPath)])
}

async function bundleTestJs(testPath: string) {
  if (
    !(await Deno.run({
      cmd: ["deno", "bundle", testPath, `${STATIC_DIR}/${pathToName(testPath)}.js`],
    })
      .status()).success
  ) {
    throw Error("deno bundle error")
  }
}

async function generateTestHtml(testPath: string) {
  await Deno.writeTextFile(
    `${STATIC_DIR}/${pathToName(testPath)}.html`,
    `<script type="module" src="${pathToName(testPath)}.js"></script>
    `.trim(),
  )
}

// ------- Browser -------
async function runBrowserTests(testPath: string) {
  const testName = pathToName(testPath)
  const browser = await puppeteer.launch()
  const testCase = await browser.newPage()
  await testCase.goto(`http://localhost:${PORT}/${testName}.html`)

  let isError = false
  try {
    await checkTest(testCase, testName!)
  } catch (_err) {
    isError = true
  }

  await browser.close()
  return { isError }
}

function checkTest(testPage: Page, testName: string) {
  return new Promise((resolve, reject) => {
    testPage.on("pageerror", function(err: Error) {
      console.error(`test "${testName}" ... FAILED \n ${err.toString()}`)
      reject(err)
    })

    testPage.on("console", (msg: any) => {
      if (msg.type() === "log") console.log(`test "${testName}" ... ok`)
      resolve("ok")
    })
  })
}

// ------- Utils -------
function pathToName(p: string) {
  return p.split("/").at(-1)?.split(".")[0]
}

function hasTsExtension(s: string) {
  return s.endsWith("ts")
}

function hasFailedTest(t: boolean[]) {
  return t.some((x) => x === true)
}
