import * as path from "../../deps/std/path.ts"
import { pathToName } from "./helpers.ts"

export const DIR_NAME = path.dirname(path.fromFileUrl(import.meta.url))
// TODO: move to target
export const STATIC_DIR = path.join(DIR_NAME, "/static")
export const PORT = +(Deno.env.get("PORT") ?? "8000")
export const TEST_PATH = Deno.args[0]!
export const TEST_NAME = pathToName(TEST_PATH)
