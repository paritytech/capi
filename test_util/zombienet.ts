export const start = async (configFile: string, env?: Record<string, string>) => {
  // TODO: change to Deno.makeTempDir
  // const networkFilesPath = `${Deno.cwd()}/tmp`
  const process = Deno.run({
    cmd: [
      // TODO: this is OS specific
      "zombienet-macos",
      // "-d",
      // networkFilesPath,
      "--provider",
      "native",
      "--force",
      "spawn",
      configFile,
    ],
    stdout: "piped",
    env,
  })
  // TODO: improve Network launched detection
  const buffer = new Uint8Array(1024)
  while (true) {
    await process.stdout?.read(buffer)
    const text = new TextDecoder().decode(buffer)
    if (text.includes("Network launched")) {
      process.stdout.close()
      break
    }
  }
  const close = async () => {
    process.kill("SIGINT")
    await process.status()
    process.close()
  }

  return { close, config: {} }
  // const { relay, paras } = JSON.parse(await Deno.readTextFile(`${networkFilesPath}/zombie.json`))
  // return { close, config: { relay, paras } }
}
