import * as path from "../deps/std/path.ts"

export const DIR_NAME = path.dirname(path.fromFileUrl(import.meta.url))
export const STATIC_DIR = path.join(DIR_NAME, "/static")
export const PORT = +(Deno.env.get("PORT") ?? "8000")
