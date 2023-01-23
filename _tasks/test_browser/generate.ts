// import * as fs from "https://deno.land/std@0.163.0/fs/mod.ts"

import { STATIC_DIR, TEST_NAME, TEST_PATH } from "./constants.ts"
import { pathToHTML, pathToJS } from "./helpers.ts"

export async function runGenerateTests() {
  // TODO: empty dir & create path folders -> .keep mocked for now
  // await fs.emptyDir(STATIC_DIR)
  await Promise.all([bundleTestJS(), generateTestHTML()])
}

async function bundleTestJS() {
  if (
    !(await Deno.run({ cmd: ["deno", "bundle", TEST_PATH, `${STATIC_DIR}/${pathToJS(TEST_PATH)}`] })
      .status()).success
  ) {
    throw 0
  }
}

async function generateTestHTML() {
  await Deno.writeTextFile(
    `${STATIC_DIR}/${pathToHTML(TEST_PATH)}`,
    `<script type="module" src="${TEST_NAME}.js"></script>
    `.trim(),
  )
}
