export function devnetsUrl() {
  const devnets = Deno.env.get("DEVNETS_SERVER")
  if (!devnets) throw new Error("Must be run with a devnets server")
  return devnets
}
