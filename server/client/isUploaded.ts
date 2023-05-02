export async function isUploaded(server: string, hash: string) {
  const url = new URL(`upload/codegen/${hash}`, server)
  const exists = await fetch(url, { method: "HEAD" })
  return exists.ok
}
