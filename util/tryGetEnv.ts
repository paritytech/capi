export function tryGetEnv(name: string): string | undefined {
  return Deno.env.get(name)
}
