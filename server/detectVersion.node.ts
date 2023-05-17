export function detectVersion(): string {
  const packageJsonPath = new URL("../package.json", import.meta.url)
  try {
    Deno.statSync(packageJsonPath)
    const packageJson = Deno.readTextFileSync(packageJsonPath)
    return JSON.parse(packageJson).version as string
  } catch (_e) {
    throw new Error(`Could not resolve \`package.json\`.`)
  }
}
