import * as f from "./factories.ts"

export async function getStatic(path: string) {
  let response
  try {
    response = await fetch(import.meta.resolve(path))
  } catch {
    throw f.notFound()
  }
  if (!response.ok) throw f.notFound()
  return await response.text()
}
