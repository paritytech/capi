import { serve } from "../../deps/std/http.ts"
import { S3Cache } from "../../util/cache/mod.ts"
import { handler } from "../handler.ts"

const controller = new AbortController()
const { signal } = controller

const dataCache = new S3Cache("", {
  accessKeyID: Deno.env.get("S3_ACCESS_KEY")!,
  secretKey: Deno.env.get("S3_SECRET_KEY")!,
  region: Deno.env.get("S3_REGION")!,
  bucket: Deno.env.get("S3_BUCKET_DATA")!,
}, signal)

const generatedCache = new S3Cache(Deno.env.get("DENO_DEPLOYMENT_ID")! + "/", {
  accessKeyID: Deno.env.get("S3_ACCESS_KEY")!,
  secretKey: Deno.env.get("S3_SECRET_KEY")!,
  region: Deno.env.get("S3_REGION")!,
  bucket: Deno.env.get("S3_BUCKET_TEMP")!,
}, signal)

serve(handler(dataCache, generatedCache))
