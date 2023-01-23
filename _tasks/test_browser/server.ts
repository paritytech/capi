import { serveDir } from "https://deno.land/std@0.172.0/http/file_server.ts"
import { serve } from "https://deno.land/std@0.172.0/http/server.ts"

import { PORT, STATIC_DIR } from "./constants.ts"

const ac = new AbortController()

const handler = async (req: Request): Promise<Response> =>
  await serveDir(req, { fsRoot: STATIC_DIR })

export const startServer = () => {
  serve(handler, { port: PORT, signal: ac.signal })
}

export const stopServer = () => ac.abort()
