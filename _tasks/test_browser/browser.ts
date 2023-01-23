// PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@16.2.0/install.ts
import puppeteer, { Page } from "https://deno.land/x/puppeteer@16.2.0/mod.ts"

import { TEST_NAME, TEST_PATH } from "./constants.ts"
import { createPausePromise, pathToHTML } from "./helpers.ts"

let testError: Error | null = null

export async function runBrowserTests() {
  const browser = await puppeteer.launch()
  const testCase = await browser.newPage()

  await testCase.goto(`http://localhost:8000/${pathToHTML(TEST_PATH)}`)
  await checkTest(testCase)

  await browser.close()

  return { testError }
}

function checkTest(testPage: Page) {
  const testProcess = createPausePromise()

  testPage.on("pageerror", function(err: Error) {
    console.error(`test "${TEST_NAME}" ... FAILED`)
    testError = err
    return testProcess.done()
  })

  testPage.on("console", (msg: any) => {
    if (msg.type() === "log") console.log(`test "${TEST_NAME}" ... ok`)
    return testProcess.done()
  })

  return testProcess.wait()
}
