export function detectServer() {
  const url = Deno.env.get("CAPI_SERVER")
  if (!url) throw new Error("Could not detect current-running Capi server")
  return url
}
