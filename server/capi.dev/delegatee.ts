import { serve } from "../../deps/std/http.ts"
import { WssProvider } from "../../providers/frame/wss.ts"
import { S3Cache } from "../../util/cache/mod.ts"
import { handler } from "../handler.ts"
import { Env } from "../mod.ts"

// this is only used by the dev providers, which should target the local server
const href = "http://localhost:4646/"

const controller = new AbortController()
const { signal } = controller

const cache = new S3Cache(Deno.env.get("DENO_DEPLOYMENT_ID")!, {
  accessKeyID: Deno.env.get("S3_ACCESS_KEY")!,
  secretKey: Deno.env.get("S3_SECRET_KEY")!,
  region: Deno.env.get("S3_REGION")!,
  bucket: Deno.env.get("S3_BUCKET")!,
}, signal)

const env = new Env(href, cache, signal, (env) => ({
  frame: {
    wss: new WssProvider(env),
  },
}))

serve(handler(env))
