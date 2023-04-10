import { fromFileUrl } from "../deps/std/path.ts"
import * as f from "./factories.ts"

export async function getStatic(path: string) {
  try {
    return await Deno.readTextFile(fromFileUrl(new URL(path, import.meta.url)))
  } catch {
    throw f.notFound()
  }
}
