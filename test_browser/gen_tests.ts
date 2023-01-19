import { STATIC_DIR } from "./constants.ts"

// TODO: Load tests -> Deno.args

await bundleCapiJS()

// await generateTestHTMLFiles(tests)

// await generatePuppeteerJS(tests)

async function bundleCapiJS() {
  if (
    !(await Deno.run({ cmd: ["deno", "bundle", "mod.ts", `${STATIC_DIR}/capi.js`] })
      .status()).success
  ) {
    throw 0
  }
}

async function _generateTestHTMLFiles(_tests: []) {
  // TODO: eg. static/derived.html
  // Deno.writeTextFile()...
}

async function _generatePuppeteerJS(_tests: []) {
  // TODO: eg. puppeteer/puppeteer.js
  // Deno.writeTextFile()...
}
