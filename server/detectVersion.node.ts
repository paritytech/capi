export async function detectVersion() {
  const packageJsonPath = new URL("../package.json", import.meta.url)
  try {
    await Deno.stat(packageJsonPath)
    const packageJson = await Deno.readTextFile(packageJsonPath)
    return JSON.parse(packageJson).version as string
  } catch (_e) {
    throw new Error(`Could not resolve \`package.json\`.`)
  }
}
