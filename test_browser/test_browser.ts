import { serveFile } from "https://deno.land/std@0.172.0/http/file_server.ts"
import { serve } from "https://deno.land/std@0.172.0/http/server.ts"
import { assertEquals } from "https://deno.land/std@0.172.0/testing/asserts.ts"

import { PORT, STATIC_DIR } from "./constants.ts"
import EXPECTED_RESULTS from "./expected_results.ts"

const handler = async (req: Request): Promise<Response> => {
  const isPOST = req.method === "POST"
  const pattern = new URLPattern({ pathname: "/:file_path" })
  const filePath = pattern.exec(req.url)?.pathname.groups.file_path
  const isFinished = filePath === "end_of_tests"

  if (isFinished) Deno.exit(0)

  if (isPOST) {
    const testName = filePath
    const testResult = await req.text()

    try {
      assertEquals(testResult, EXPECTED_RESULTS[testName!])
      console.log(`test ${testName} ... ok`)
    } catch (err) {
      console.error(`test ${testName} ... FAILED`, "\n", err)
      Deno.exit(1)
    }

    return new Response()
  }

  return await serveFile(req, `${STATIC_DIR}/${filePath}`)
}

await serve(handler, { port: PORT })
