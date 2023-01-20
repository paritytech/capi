import { serveFile } from "https://deno.land/std@0.172.0/http/file_server.ts"
import { serve } from "https://deno.land/std@0.172.0/http/server.ts"

import { PORT, STATIC_DIR } from "./constants.ts"

const ac = new AbortController()

const handler = async (req: Request): Promise<Response> => {
  const pattern = new URLPattern({ pathname: "/:file_path" })
  const filePath = pattern.exec(req.url)?.pathname.groups.file_path
  const isFinished = filePath === "end_of_tests"

  if (isFinished) {
    console.log("Closing the server...")
    ac.abort()
  }

  return await serveFile(req, `${STATIC_DIR}/${filePath}`)
}

await serve(handler, { port: PORT, signal: ac.signal })
